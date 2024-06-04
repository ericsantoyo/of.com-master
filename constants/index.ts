export interface NavLink {
  id: string;
  title: string;
}

export interface ClubIcon {
  badgeColor: string;
  name: string;
  id: string; 
  shortName: string;
  slug: string;
  dspId: number; 
}

export const navLinks: NavLink[] = [
  {
    id: "/partidos",
    title: "PARTIDOS",
  },
  {
    id: "/market",
    title: "MERCADO",
  },
  {
    id: "/stats",
    title: "ESTADÍSTICAS",
  },
  {
    id: "/news",
    title: "NOTICIAS",
  },
];

export const clubIcons: ClubIcon[] = [
  {
    badgeColor: "/teamLogos/d-alaves.png",
    name: "Deportivo Alavés",
    id: "21",
    shortName: "ALA",
    slug: "d-alaves",
    dspId: 66,
  },
  {
    badgeColor: "/teamLogos/ud-almeria.png",
    name: "UD Almería",
    id: "1",
    shortName: "ALM",
    slug: "ud-almeria",
    dspId: 56,
  },
  {
    badgeColor: "/teamLogos/athletic-club.png",
    name: "Athletic Club",
    id: "3",
    shortName: "ATH",
    slug: "athletic-club",
    dspId: 68,
  },
  {
    badgeColor: "/teamLogos/atletico-de-madrid.png",
    name: "Atlético de Madrid",
    id: "2",
    shortName: "ATM",
    slug: "atletico-de-madrid",
    dspId: 70,
  },
  {
    badgeColor: "/teamLogos/fc-barcelona.png",
    name: "FC Barcelona",
    id: "4",
    shortName: "BAR",
    slug: "fc-barcelona",
    dspId: 74,
  },
  {
    badgeColor: "/teamLogos/real-betis.png",
    name: "Real Betis",
    id: "5",
    shortName: "BET",
    slug: "real-betis",
    dspId: 81,
  },
  {
    badgeColor: "/teamLogos/cadiz-cf.png",
    name: "Cádiz CF",
    id: "162",
    shortName: "CAD",
    slug: "cadiz-cf",
    dspId: 67,
  },
  {
    badgeColor: "/teamLogos/rc-celta.png",
    name: "RC Celta",
    id: "6",
    shortName: "CEL",
    slug: "rc-celta",
    dspId: 71,
  },
  {
    badgeColor: "/teamLogos/getafe-cf.png",
    name: "Getafe CF",
    id: "9",
    shortName: "GET",
    slug: "getafe-cf",
    dspId: 51,
  },
  {
    badgeColor: "/teamLogos/girona-fc.png",
    name: "Girona FC",
    id: "28",
    shortName: "GIR",
    slug: "girona-fc",
    dspId: 151,
  },
  {
    badgeColor: "/teamLogos/granada-cf.png",
    name: "Granada CF",
    id: "10",
    shortName: "GRA",
    slug: "granada-cf",
    dspId: 206,
  },
  {
    badgeColor: "/teamLogos/ud-las-palmas.png",
    name: "UD Las Palmas",
    id: "31",
    shortName: "LPA",
    slug: "ud-las-palmas",
    dspId: 181,
  },
  {
    badgeColor: "/teamLogos/rcd-mallorca.png",
    name: "RCD Mallorca",
    id: "33",
    shortName: "MLL",
    slug: "rcd-mallorca",
    dspId: 77,
  },
  {
    badgeColor: "/teamLogos/c-a-osasuna.png",
    name: "C.A. Osasuna",
    id: "13",
    shortName: "OSA",
    slug: "c-a-osasuna",
    dspId: 190,
  },
  {
    badgeColor: "/teamLogos/rayo-vallecano.png",
    name: "Rayo Vallecano",
    id: "14",
    shortName: "RAY",
    slug: "rayo-vallecano",
    dspId: 80,
  },
  {
    badgeColor: "/teamLogos/real-madrid.png",
    name: "Real Madrid",
    id: "15",
    shortName: "RMA",
    slug: "real-madrid",
    dspId: 82,
  },
  {
    badgeColor: "/teamLogos/real-sociedad.png",
    name: "Real Sociedad",
    id: "16",
    shortName: "RSO",
    slug: "real-sociedad",
    dspId: 84,
  },
  {
    badgeColor: "/teamLogos/sevilla-fc.png",
    name: "Sevilla FC",
    id: "17",
    shortName: "SEV",
    slug: "sevilla-fc",
    dspId: 75,
  },
  {
    badgeColor: "/teamLogos/valencia-cf.png",
    name: "Valencia CF",
    id: "18",
    shortName: "VAL",
    slug: "valencia-cf",
    dspId: 88,
  },
  {
    badgeColor: "/teamLogos/villarreal-cf.png",
    name: "Villarreal CF",
    id: "20",
    shortName: "VIL",
    slug: "villarreal-cf",
    dspId: 189,
  },
];
