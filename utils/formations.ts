// utils/formations.ts

// Define a data structure for formations and positions
const formations = [
    {
        id: 1,
        name: '4-3-3',
        positions: [
            { id: 1, role: 'Goalkeeper', x: 48, y: 89 },
            { id: 2, role: 'Defender', x: 10, y: 75 },
            { id: 3, role: 'Defender', x: 35, y: 78 },
            { id: 4, role: 'Defender', x: 60, y: 78 },
            { id: 5, role: 'Defender', x: 85, y: 75 },
            { id: 6, role: 'Midfielder', x: 48, y: 48 },
            { id: 7, role: 'Midfielder', x: 22, y: 48 },
            { id: 8, role: 'Midfielder', x: 71, y: 48 },
            { id: 9, role: 'Forward', x: 10, y: 22 },
            { id: 10, role: 'Forward', x: 48, y: 22 },
            { id: 11, role: 'Forward', x: 85, y: 22 }
        ]
    },
    {
        id: 2,
        name: '4-4-2',
        positions: [
            { id: 1, role: 'Goalkeeper', x: 48, y: 89 },
            { id: 2, role: 'Defender', x: 10, y: 75 },
            { id: 3, role: 'Defender', x: 35, y: 78 },
            { id: 4, role: 'Defender', x: 60, y: 78 },
            { id: 5, role: 'Defender', x: 86, y: 75 },
            { id: 6, role: 'Midfielder', x: 11, y: 48 },
            { id: 7, role: 'Midfielder', x: 34, y: 50 },
            { id: 8, role: 'Midfielder', x: 60, y: 50 },
            { id: 9, role: 'Midfielder', x: 84, y: 48 },
            { id: 10, role: 'Forward', x: 35, y: 16 },
            { id: 11, role: 'Forward', x: 60, y: 16 },
        ]
    },
    {
        id: 3,
        name: "3-4-3",
        positions: [
            { id: 1, role: "Goalkeeper", x: 48, y: 89 },
            { id: 2, role: "Defender", x: 20, y: 73 },
            { id: 3, role: "Defender", x: 48, y: 73 },
            { id: 4, role: "Defender", x: 75, y: 73 },
            { id: 5, role: 'Midfielder', x: 11, y: 48 },
            { id: 6, role: 'Midfielder', x: 35, y: 50 },
            { id: 7, role: 'Midfielder', x: 60, y: 50 },
            { id: 8, role: 'Midfielder', x: 84, y: 48 },
            { id: 9, role: 'Forward', x: 10, y: 22 },
            { id: 10, role: 'Forward', x: 48, y: 20 },
            { id: 11, role: 'Forward', x: 85, y: 22 }
        ]
    },
    {
        id: 4,
        name: "4-2-4",
        positions: [
            { id: 1, role: "Goalkeeper", x: 48, y: 89 },
            { id: 2, role: 'Defender', x: 11, y: 75 },
            { id: 3, role: 'Defender', x: 35, y: 78 },
            { id: 4, role: 'Defender', x: 60, y: 78 },
            { id: 5, role: 'Defender', x: 84, y: 75 },
            { id: 6, role: 'Midfielder', x: 30, y: 48 },
            { id: 7, role: 'Midfielder', x: 64, y: 48 },
            { id: 8, role: 'Forward', x: 10, y: 23 },
            { id: 9, role: 'Forward', x: 35, y: 20 },
            { id: 10, role: 'Forward', x: 60, y: 20 },
            { id: 11, role: 'Forward', x: 85, y: 23 }
        ]
    },


];

// Function to retrieve positions for a specific formation
const getPositionsForFormation = (formationName: string) => {
    const formation = formations.find(form => form.name === formationName);
    return formation ? formation.positions : [];
};

export { formations, getPositionsForFormation };
