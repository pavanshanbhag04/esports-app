require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const twilio = require('twilio');
const session = require('express-session');

const port = process.env.PORT || 3000;
const app = express();

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour session
}));

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));



// --- Twilio Setup ---
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// --- Mongoose Schemas ---
const UserSchema = new mongoose.Schema({
    Username: String,
    Email: { type: String, unique: true },
    PlayerID: { type: Number, unique: true },
    Age: Number,
    State: String,
    Password: String,
    Phone: String
});
const Players = mongoose.model("Players", UserSchema);

const BGMIteam = mongoose.model("BGMIteam", new mongoose.Schema({
    BGMI_Team_name: String,
    Player_ID: { type: Number, unique: true },
    BGMI_Team_ID: { type: Number, unique: true },
    Phone: String
}));

const CSGOteam = mongoose.model("CSGOteam", new mongoose.Schema({
    CSGO_Team_name: String,
    Player_ID: { type: Number, unique: true },
    CSGO_Team_ID: { type: Number, unique: true },
    Phone: String
}));

const Results = mongoose.model("Results", new mongoose.Schema({
    Trnt_ID: { type: Number, unique: true },
    BG_wnr_ID: Number,
    CS_wnr_ID: Number,
    BG_wnr_phone: String,
    CS_wnr_phone: String
}));

// --- Utility: Send SMS ---
function sendSMS(phone, message) {
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
    }
    twilioClient.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhone
        })
        .then(msg => console.log(`📩 SMS sent to ${formattedPhone} - SID: ${msg.sid}`))
        .catch(err => console.error(`❌ SMS failed to ${formattedPhone}:`, err));
}

// --- Middleware: Admin Login Check ---
function isAdminLoggedIn(req, res, next) {
    if (req.session && req.session.adminLoggedIn) return next();
    res.redirect('/admin/login');
}

// --- Static Files ---
app.use(express.static(path.join(__dirname, 'Esports')));

// --- Routes ---

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Esports', 'form.html'));
});

// Admin Login Page
app.get('/admin/login', (req, res) => {
    if (req.session && req.session.adminLoggedIn) {
        // Serve a small HTML with JavaScript confirmation
        res.send(`
            <script>
                if (confirm("Already logged in. Do you want to logout?")) {
                    window.location.href = "/admin/logout";
                } else {
                    window.location.href = "/index.html";
                }
            </script>
        `);
    } else {
        res.sendFile(path.join(__dirname, 'Esports', 'admin_login.html'));
    }
});

// Admin Login Handler
app.post('/admin_login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.adminLoggedIn = true;
        res.redirect('/index.html');
    } else {
        res.send('<script>alert("Invalid credentials"); window.location.href="/admin/login";</script>');
    }
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.send('<script>alert("Logout failed."); window.location.href="/index.html";</script>');
        }
        res.clearCookie('connect.sid');
        res.send('<script>alert("Logged out successfully."); window.location.href="/admin/login";</script>');
    });
});

// 🔐 Admin-Protected Result View Page
app.get('/admin/result_for_user', isAdminLoggedIn, (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'Esports', 'result_for_user.html'));    
});

// --- Player Registration ---
app.post('/post', async (req, res) => {
    try {
        const player = new Players(req.body);
        await player.save();
        res.send('<script>alert("Player registered successfully"); window.location.href = "/";</script>');
    } catch (error) {
        if (error.code === 11000) {
            res.send('<script>alert("Email or PlayerID already exists"); window.location.href = "/";</script>');
        } else {
            console.error('Player registration error:', error);
            res.send('<script>alert("Registration failed"); window.location.href = "/";</script>');
        }
    }
});

// --- BGMI Team Registration ---
app.get('/bgmi_post', (req, res) =>
    res.sendFile(path.join(__dirname, 'Esports', 'bgmi_regist.html'))
);

app.post('/bgmi_post', async (req, res) => {
    const { Player_ID, Phone } = req.body;
    try {
        const player = await Players.findOne({ PlayerID: Number(Player_ID) });
        if (!player || player.Phone !== Phone) {
            return res.send('<script>alert("Invalid Player ID or Phone"); window.location.href="/bgmi_regist.html";</script>');
        }
        await new BGMIteam(req.body).save();
        res.send('<script>alert("BGMI Team Registered"); window.location.href="/index.html";</script>');
    } catch (err) {
        console.error('BGMI registration error:', err);
        res.send('<script>alert("BGMI Registration failed or duplicate entry"); window.location.href="/bgmi_regist.html";</script>');
    }
});

// --- CSGO Team Registration ---
app.get('/csgo_post', (req, res) =>
    res.sendFile(path.join(__dirname, 'Esports', 'csgo_regist.html'))
);

app.post('/csgo_post', async (req, res) => {
    const { Player_ID, Phone } = req.body;
    try {
        const player = await Players.findOne({ PlayerID: Number(Player_ID) });
        if (!player || player.Phone !== Phone) {
            return res.send('<script>alert("Invalid Player ID or Phone"); window.location.href="/csgo_regist.html";</script>');
        }
        await new CSGOteam(req.body).save();
        res.send('<script>alert("CSGO Team Registered"); window.location.href="/index.html";</script>');
    } catch (err) {
        console.error('CSGO registration error:', err);
        res.send('<script>alert("CSGO Registration failed or duplicate entry"); window.location.href="/csgo_regist.html";</script>');
    }
});

// --- BGMI Result Submission (Admin Only) ---
app.get('/Create_bgmi_result', isAdminLoggedIn, (req, res) =>
    res.sendFile(path.join(__dirname, 'Esports', 'bgmi_result.html'))
);

app.post('/Create_bgmi_result', isAdminLoggedIn, async (req, res) => {
    const { Trnt_ID, bgmi_wnr, bgmi_phone } = req.body;
    try {
        const team = await BGMIteam.findOne({ BGMI_Team_ID: Number(bgmi_wnr), Phone: bgmi_phone });
        if (!team) {
            return res.send('<script>alert("Invalid BGMI Team ID or Phone"); window.location.href="/Create_bgmi_result";</script>');
        }
        await Results.findOneAndUpdate(
            { Trnt_ID: Number(Trnt_ID) },
            { BG_wnr_ID: Number(bgmi_wnr), BG_wnr_phone: bgmi_phone },
            { upsert: true }
        );
        sendSMS(bgmi_phone, `🏆 Congrats! BGMI team ID ${bgmi_wnr} won Tournament ${Trnt_ID}`);
        res.send('<script>alert("BGMI result saved & SMS sent."); window.location.href="/index.html";</script>');
    } catch (err) {
        console.error('BGMI result submission error:', err);
        res.send('<script>alert("Error saving BGMI result"); window.location.href="/Create_bgmi_result";</script>');
    }
});

// --- CSGO Result Submission (Admin Only) ---
app.get('/Create_csgo_result', isAdminLoggedIn, (req, res) =>
    res.sendFile(path.join(__dirname, 'Esports', 'csgo_result.html'))
);

app.post('/Create_csgo_result', isAdminLoggedIn, async (req, res) => {
    const { Trnt_ID, csgo_wnr, csgo_phone } = req.body;
    try {
        const team = await CSGOteam.findOne({ CSGO_Team_ID: Number(csgo_wnr), Phone: csgo_phone });
        if (!team) {
            return res.send('<script>alert("Invalid CSGO Team ID or Phone"); window.location.href="/Create_csgo_result";</script>');
        }
        await Results.findOneAndUpdate(
            { Trnt_ID: Number(Trnt_ID) },
            { CS_wnr_ID: Number(csgo_wnr), CS_wnr_phone: csgo_phone },
            { upsert: true }
        );
        sendSMS(csgo_phone, `🏆 Congrats! CSGO team ID ${csgo_wnr} won Tournament ${Trnt_ID}`);
        res.send('<script>alert("CSGO result saved & SMS sent."); window.location.href="/index.html";</script>');
    } catch (err) {
        console.error('CSGO result submission error:', err);
        res.send('<script>alert("Error saving CSGO result"); window.location.href="/Create_csgo_result";</script>');
    }
});

// --- API Endpoints for Data Retrieval (Optional) ---
// Get all results (Admin only)
app.get('/api/results', isAdminLoggedIn, async (req, res) => {
    try {
        const results = await Results.find({});
        res.json(results);
    } catch (err) {
        console.error('Error fetching results:', err);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

// Get specific tournament result
app.get('/api/results/:tournamentId', async (req, res) => {
    try {
        const result = await Results.findOne({ Trnt_ID: Number(req.params.tournamentId) });
        if (!result) {
            return res.status(404).json({ error: 'Tournament result not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error fetching tournament result:', err);
        res.status(500).json({ error: 'Failed to fetch tournament result' });
    }
});

// --- New API endpoint for all declared results for a game ---
app.get('/api/all_results/:game', async (req, res) => {
    const { game } = req.params;
    try {
        let results = await Results.find({});
        let teamModel, teamField, teamIdField, resultTeamIdField;
        if (game === 'bgmi') {
            teamModel = BGMIteam;
            teamField = 'BGMI_Team_name';
            teamIdField = 'BGMI_Team_ID';
            resultTeamIdField = 'BG_wnr_ID';
        } else if (game === 'csgo') {
            teamModel = CSGOteam;
            teamField = 'CSGO_Team_name';
            teamIdField = 'CSGO_Team_ID';
            resultTeamIdField = 'CS_wnr_ID';
        } else {
            return res.status(400).json({ error: 'Invalid game' });
        }

        // Filter only results where winner is declared for this game
        results = results.filter(r => r[resultTeamIdField]);
        const response = [];
        for (const r of results) {
            const team = await teamModel.findOne({ [teamIdField]: r[resultTeamIdField] });
            if (team) {
                response.push({
                    tournamentId: r.Trnt_ID,
                    teamName: team[teamField],
                    teamId: r[resultTeamIdField]
                });
            }
        }
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- NEW API ENDPOINT: View Declared Result ---
app.get('/api/view_result/:game/:tournamentId', async (req, res) => {
    const { game, tournamentId } = req.params;
    try {
        const result = await Results.findOne({ Trnt_ID: Number(tournamentId) });
        if (!result) return res.status(404).json({ error: 'Result not declared' });

        let teamId, teamModel, teamField;
        if (game === 'bgmi') {
            teamId = result.BG_wnr_ID;
            teamModel = BGMIteam;
            teamField = 'BGMI_Team_name';
        } else if (game === 'csgo') {
            teamId = result.CS_wnr_ID;
            teamModel = CSGOteam;
            teamField = 'CSGO_Team_name';
        } else {
            return res.status(400).json({ error: 'Invalid game' });
        }

        const team = await teamModel.findOne({ [game === 'bgmi' ? 'BGMI_Team_ID' : 'CSGO_Team_ID']: teamId });
        if (!team) return res.status(404).json({ error: 'Team not found' });

        res.json({
            tournamentId: result.Trnt_ID,
            teamName: team[teamField],
            teamId: teamId
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).send('<script>alert("Server error occurred"); window.history.back();</script>');
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).send('<script>alert("Page not found"); window.location.href="/";</script>');
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    mongoose.connection.close(() => {
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    });
});
