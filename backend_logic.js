const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Əsas funksiya: "Website yoxdur" + "Telefon var" + "Status new"
app.get('/api/leads/golden', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            where: {
                hasWebsite: false,
                NOT: { phone: null },
                status: 'new'
            }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Data fetch failed' });
    }
});

app.get('/api/leads', async (req, res) => {
    const { category, city, status } = req.query;
    const leads = await prisma.lead.findMany({
        where: {
            category: category || undefined,
            city: city || undefined,
            status: status || undefined
        }
    });
    res.json(leads);
});

app.post('/api/leads', async (req, res) => {
    const lead = await prisma.lead.create({ data: req.body });
    res.json(lead);
});

app.patch('/api/leads/:id', async (req, res) => {
    const { id } = req.params;
    const updated = await prisma.lead.update({
        where: { id: Number(id) },
        data: req.body
    });
    res.json(updated);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));