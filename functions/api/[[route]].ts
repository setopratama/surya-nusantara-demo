import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { sql, eq, desc } from 'drizzle-orm';
import * as schema from '../../src/db/schema';
import { participants, quizSessions, quizAnswers } from '../../src/db/schema';

type Bindings = {
  DB?: D1Database;
};

// ─────────────────────────────────────────
// In-Memory Fallback Data Store (Demo Mode Tanpa D1)
// Selaras 100% dengan tampilan lokal demonstrasi klien
// ─────────────────────────────────────────
interface MockParticipant {
  id: string;
  name: string;
  ageBand: string;
  domicile: string;
  occupation: string;
  currentBrand: string;
  time: string;
  createdAt: string;
  sessionId: string;
  totalScore: number;
  isCompleted: boolean;
  completedAt: string | null;
}

const INITIAL_MOCK_PARTICIPANTS: MockParticipant[] = [
  {
    id: 'p-1',
    name: 'Aditya Pratama',
    ageBand: '25–34',
    domicile: 'Surabaya',
    occupation: 'Profesional / Karyawan Swasta',
    currentBrand: 'Surya 12',
    time: '10 Nov 2026, 13:18 WIB',
    createdAt: '2026-11-10 13:18:00',
    sessionId: 's-1',
    totalScore: 88,
    isCompleted: true,
    completedAt: '2026-11-10 13:21:30',
  },
  {
    id: 'p-2',
    name: 'Cahyo Wibowo',
    ageBand: '25–34',
    domicile: 'Malang',
    occupation: 'Industri Kreatif / Media',
    currentBrand: 'Surya Nusantara',
    time: '10 Nov 2026, 13:12 WIB',
    createdAt: '2026-11-10 13:12:00',
    sessionId: 's-2',
    totalScore: 94,
    isCompleted: true,
    completedAt: '2026-11-10 13:15:10',
  },
  {
    id: 'p-3',
    name: 'Fajar Nugraha',
    ageBand: '25–34',
    domicile: 'Surabaya',
    occupation: 'Keuangan / Perbankan',
    currentBrand: 'Surya Nusantara',
    time: '10 Nov 2026, 13:05 WIB',
    createdAt: '2026-11-10 13:05:00',
    sessionId: 's-3',
    totalScore: 100,
    isCompleted: true,
    completedAt: '2026-11-10 13:08:12',
  },
  {
    id: 'p-4',
    name: 'Bambang Sudiro',
    ageBand: '35–44',
    domicile: 'Semarang',
    occupation: 'Wirausaha / Pemilik Usaha',
    currentBrand: 'Surya PRO',
    time: '10 Nov 2026, 12:48 WIB',
    createdAt: '2026-11-10 12:48:00',
    sessionId: 's-4',
    totalScore: 76,
    isCompleted: true,
    completedAt: '2026-11-10 12:51:15',
  },
  {
    id: 'p-5',
    name: 'Hendra Wijaya',
    ageBand: '25–34',
    domicile: 'Malang',
    occupation: 'Komersial / Penjualan',
    currentBrand: 'Surya 12',
    time: '10 Nov 2026, 12:35 WIB',
    createdAt: '2026-11-10 12:35:00',
    sessionId: 's-5',
    totalScore: 84,
    isCompleted: true,
    completedAt: '2026-11-10 12:38:40',
  },
  {
    id: 'p-6',
    name: 'Eko Prasetyo',
    ageBand: '35–44',
    domicile: 'Bandung',
    occupation: 'Teknik / Konstruksi',
    currentBrand: 'Djarum Super',
    time: '10 Nov 2026, 12:20 WIB',
    createdAt: '2026-11-10 12:20:00',
    sessionId: 's-6',
    totalScore: 82,
    isCompleted: true,
    completedAt: '2026-11-10 12:23:45',
  },
  {
    id: 'p-7',
    name: 'Indra Saputra',
    ageBand: '25–34',
    domicile: 'Surabaya',
    occupation: 'Transportasi / Logistik',
    currentBrand: 'Surya Nusantara',
    time: '10 Nov 2026, 12:08 WIB',
    createdAt: '2026-11-10 12:08:00',
    sessionId: 's-7',
    totalScore: 79,
    isCompleted: true,
    completedAt: '2026-11-10 12:11:55',
  },
  {
    id: 'p-8',
    name: 'Gunawan Santoso',
    ageBand: '45+',
    domicile: 'Surakarta / Solo',
    occupation: 'Perajin Logam & Kayu',
    currentBrand: 'Gudang Garam Merah',
    time: '10 Nov 2026, 11:52 WIB',
    createdAt: '2026-11-10 11:52:00',
    sessionId: 's-8',
    totalScore: 73,
    isCompleted: true,
    completedAt: '2026-11-10 11:55:05',
  },
  {
    id: 'p-9',
    name: 'Dimas Kurniawan',
    ageBand: '18–24 (21+ Confirmed)',
    domicile: 'Yogyakarta',
    occupation: 'Teknologi Informasi / IT',
    currentBrand: 'Sampoerna A Mild',
    time: '10 Nov 2026, 11:38 WIB',
    createdAt: '2026-11-10 11:38:00',
    sessionId: 's-9',
    totalScore: 68,
    isCompleted: true,
    completedAt: '2026-11-10 11:41:22',
  },
  {
    id: 'p-10',
    name: 'Joko Susanto',
    ageBand: '35–44',
    domicile: 'Denpasar',
    occupation: 'Pariwisata & Hospitality',
    currentBrand: 'Dji Sam Soe',
    time: '10 Nov 2026, 11:25 WIB',
    createdAt: '2026-11-10 11:25:00',
    sessionId: 's-10',
    totalScore: 70,
    isCompleted: true,
    completedAt: '2026-11-10 11:28:20',
  },
];

let inMemoryParticipants: MockParticipant[] = [...INITIAL_MOCK_PARTICIPANTS];

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// Enable CORS for API routes
app.use('*', cors());

// Helper to get Drizzle DB instance if available
function getDb(env: Bindings) {
  if (!env.DB) return null;
  return drizzle(env.DB, { schema });
}

// ─────────────────────────────────────────
// POST /api/register
// ─────────────────────────────────────────
app.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { name, ageBand, isConfirmed21Plus, domicile, occupation, currentBrand } = body;

    if (!name || !ageBand || !isConfirmed21Plus || !domicile || !occupation || !currentBrand) {
      return c.json({ success: false, error: 'Data registrasi tidak lengkap atau tidak valid.' }, 400);
    }

    const participantId = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    const db = getDb(c.env);

    if (db) {
      await db.insert(participants).values({
        id: participantId,
        name: String(name).trim(),
        ageBand: String(ageBand),
        isConfirmed21Plus: Boolean(isConfirmed21Plus),
        domicile: String(domicile).trim(),
        occupation: String(occupation).trim(),
        currentBrand: String(currentBrand).trim(),
      });

      await db.insert(quizSessions).values({
        id: sessionId,
        participantId: participantId,
        totalScore: 0,
        isCompleted: false,
      });
    } else {
      // In-Memory fallback untuk demo tanpa D1
      const now = new Date();
      const timeStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      inMemoryParticipants.unshift({
        id: participantId,
        name: String(name).trim(),
        ageBand: String(ageBand),
        domicile: String(domicile).trim(),
        occupation: String(occupation).trim(),
        currentBrand: String(currentBrand).trim(),
        time: timeStr,
        createdAt: now.toISOString().replace('T', ' ').slice(0, 19),
        sessionId,
        totalScore: 0,
        isCompleted: false,
        completedAt: null,
      });
    }

    return c.json({ success: true, participantId, sessionId });
  } catch (err: any) {
    return c.json({ success: false, error: err?.message || 'Gagal mendaftarkan peserta' }, 500);
  }
});

// ─────────────────────────────────────────
// POST /api/submit-quiz
// ─────────────────────────────────────────
app.post('/submit-quiz', async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, results } = body;

    if (!sessionId || !Array.isArray(results) || results.length === 0) {
      return c.json({ success: false, error: 'Data sesi kuis tidak valid.' }, 400);
    }

    const totalScore = results.reduce((acc: number, curr: any) => acc + (Number(curr.pointsEarned) || 0), 0);
    const clampedScore = Math.min(100, Math.max(0, totalScore));
    const db = getDb(c.env);

    if (db) {
      // Update quiz session
      await db
        .update(quizSessions)
        .set({
          totalScore: clampedScore,
          isCompleted: true,
          completedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(quizSessions.id, sessionId));

      // Insert answers
      const answersToInsert = results.map((r: any, idx: number) => ({
        id: crypto.randomUUID(),
        sessionId: sessionId,
        questionId: String(r.questionId),
        questionIndex: idx + 1,
        selectedOptionId: r.selectedOptionId ? String(r.selectedOptionId) : null,
        isCorrect: Boolean(r.isCorrect),
        elapsedSeconds: Number(r.elapsedSeconds) || 10.0,
        pointsEarned: Number(r.pointsEarned) || 0,
      }));

      await db.insert(quizAnswers).values(answersToInsert);
    } else {
      // In-Memory fallback untuk demo tanpa D1
      const item = inMemoryParticipants.find((p) => p.sessionId === sessionId);
      if (item) {
        item.totalScore = clampedScore;
        item.isCompleted = true;
        item.completedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
      }
    }

    return c.json({ success: true, sessionId, totalScore: clampedScore });
  } catch (err: any) {
    return c.json({ success: false, error: err?.message || 'Gagal menyimpan hasil kuis' }, 500);
  }
});

// ─────────────────────────────────────────
// GET /api/stats (Reporting KPIs & Distributions)
// ─────────────────────────────────────────
app.get('/stats', async (c) => {
  try {
    const db = getDb(c.env);

    if (db) {
      // 1. Total participants
      const totalPartRes = await db
        .select({ count: sql<number>`count(*)` })
        .from(participants);
      const totalParticipants = totalPartRes[0]?.count ?? 0;

      // 2. Completed sessions stats
      const sessionsRes = await db
        .select({
          completedCount: sql<number>`count(*)`,
          avgScore: sql<number>`coalesce(round(avg(${quizSessions.totalScore}), 1), 0)`,
          maxScore: sql<number>`coalesce(max(${quizSessions.totalScore}), 0)`,
        })
        .from(quizSessions)
        .where(eq(quizSessions.isCompleted, true));

      const completedStats = sessionsRes[0] || { completedCount: 0, avgScore: 0, maxScore: 0 };

      // 3. Score distribution buckets
      const distRes = await db
        .select({
          bucket_0_20: sql<number>`sum(case when ${quizSessions.totalScore} between 0 and 20 then 1 else 0 end)`,
          bucket_21_40: sql<number>`sum(case when ${quizSessions.totalScore} between 21 and 40 then 1 else 0 end)`,
          bucket_41_60: sql<number>`sum(case when ${quizSessions.totalScore} between 41 and 60 then 1 else 0 end)`,
          bucket_61_80: sql<number>`sum(case when ${quizSessions.totalScore} between 61 and 80 then 1 else 0 end)`,
          bucket_81_100: sql<number>`sum(case when ${quizSessions.totalScore} between 81 and 100 then 1 else 0 end)`,
        })
        .from(quizSessions)
        .where(eq(quizSessions.isCompleted, true));

      const distribution = distRes[0] || {
        bucket_0_20: 0,
        bucket_21_40: 0,
        bucket_41_60: 0,
        bucket_61_80: 0,
        bucket_81_100: 0,
      };

      // 4. Top cities
      const citiesRes = await db
        .select({
          domicile: participants.domicile,
          count: sql<number>`count(*)`,
        })
        .from(participants)
        .groupBy(participants.domicile)
        .orderBy(sql`count(*) desc`)
        .limit(6);

      return c.json({
        success: true,
        stats: {
          totalParticipants,
          totalCompleted: completedStats.completedCount,
          averageScore: completedStats.avgScore,
          maxScore: completedStats.maxScore,
          scoreDistribution: {
            '0-20': distribution.bucket_0_20 || 0,
            '21-40': distribution.bucket_21_40 || 0,
            '41-60': distribution.bucket_41_60 || 0,
            '61-80': distribution.bucket_61_80 || 0,
            '81-100': distribution.bucket_81_100 || 0,
          },
          topCities: citiesRes,
        },
      });
    }

    // In-Memory Fallback untuk demo tanpa D1:
    // Selaras dengan DEMO_OVERVIEW_STATS di tampilan lokal dashboard
    const newPlayCount = inMemoryParticipants.length - INITIAL_MOCK_PARTICIPANTS.length;
    const baseTotal = 1248 + Math.max(0, newPlayCount);
    const baseCompleted = 1154 + Math.max(0, newPlayCount);

    return c.json({
      success: true,
      stats: {
        totalParticipants: baseTotal,
        totalCompleted: baseCompleted,
        averageScore: 76.8,
        maxScore: 100,
        scoreDistribution: {
          '81-100': 48,
          '61-80': 32,
          '41-60': 14,
          '21-40': 4,
          '0-20': 2,
        },
        topCities: [
          { domicile: 'Surabaya', count: 432, percentage: 85 },
          { domicile: 'Malang', count: 318, percentage: 65 },
          { domicile: 'Semarang', count: 224, percentage: 48 },
          { domicile: 'Surakarta / Solo', count: 152, percentage: 34 },
          { domicile: 'Yogyakarta', count: 122, percentage: 26 },
        ],
      },
    });
  } catch (err: any) {
    return c.json({ success: false, error: err?.message || 'Gagal mengambil statistik' }, 500);
  }
});

// ─────────────────────────────────────────
// GET /api/participants (Dashboard Table Data)
// ─────────────────────────────────────────
app.get('/participants', async (c) => {
  try {
    const db = getDb(c.env);

    if (db) {
      const rows = await db
        .select({
          id: participants.id,
          name: participants.name,
          ageBand: participants.ageBand,
          domicile: participants.domicile,
          occupation: participants.occupation,
          currentBrand: participants.currentBrand,
          createdAt: participants.createdAt,
          sessionId: quizSessions.id,
          totalScore: quizSessions.totalScore,
          isCompleted: quizSessions.isCompleted,
          completedAt: quizSessions.completedAt,
        })
        .from(participants)
        .leftJoin(quizSessions, eq(participants.id, quizSessions.participantId))
        .orderBy(desc(participants.createdAt))
        .limit(50);

      return c.json({ success: true, participants: rows });
    }

    // In-Memory Fallback untuk demo tanpa D1
    return c.json({ success: true, participants: inMemoryParticipants });
  } catch (err: any) {
    return c.json({ success: false, error: err?.message || 'Gagal mengambil data peserta' }, 500);
  }
});

// ─────────────────────────────────────────
// POST /api/seed (Mock Data Generator for Client Demo)
// ─────────────────────────────────────────
app.post('/seed', async (c) => {
  try {
    inMemoryParticipants = [...INITIAL_MOCK_PARTICIPANTS];
    return c.json({ success: true, message: `Berhasil menyiapkan data simulasi kuis demo.` });
  } catch (err: any) {
    return c.json({ success: false, error: err?.message || 'Gagal seeding data' }, 500);
  }
});

export const onRequest = handle(app);
