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
// ─────────────────────────────────────────
interface MockParticipant {
  id: string;
  name: string;
  ageBand: string;
  domicile: string;
  occupation: string;
  currentBrand: string;
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
    createdAt: '2026-11-10 15:45:00',
    sessionId: 's-1',
    totalScore: 88,
    isCompleted: true,
    completedAt: '2026-11-10 15:48:30',
  },
  {
    id: 'p-2',
    name: 'Bambang Sudiro',
    ageBand: '35–44',
    domicile: 'Semarang',
    occupation: 'Wirausaha / Pemilik Usaha',
    currentBrand: 'Surya PRO',
    createdAt: '2026-11-10 15:30:00',
    sessionId: 's-2',
    totalScore: 76,
    isCompleted: true,
    completedAt: '2026-11-10 15:33:15',
  },
  {
    id: 'p-3',
    name: 'Cahyo Wibowo',
    ageBand: '25–34',
    domicile: 'Malang',
    occupation: 'Industri Kreatif / Media',
    currentBrand: 'Surya Nusantara',
    createdAt: '2026-11-10 15:24:00',
    sessionId: 's-3',
    totalScore: 94,
    isCompleted: true,
    completedAt: '2026-11-10 15:27:10',
  },
  {
    id: 'p-4',
    name: 'Dimas Kurniawan',
    ageBand: '18–24',
    domicile: 'Yogyakarta',
    occupation: 'Teknologi / IT',
    currentBrand: 'Sampoerna A Mild',
    createdAt: '2026-11-10 15:15:00',
    sessionId: 's-4',
    totalScore: 65,
    isCompleted: true,
    completedAt: '2026-11-10 15:18:22',
  },
  {
    id: 'p-5',
    name: 'Eko Prasetyo',
    ageBand: '35–44',
    domicile: 'Bandung',
    occupation: 'Teknik / Konstruksi',
    currentBrand: 'Djarum Super',
    createdAt: '2026-11-10 15:05:00',
    sessionId: 's-5',
    totalScore: 82,
    isCompleted: true,
    completedAt: '2026-11-10 15:08:45',
  },
  {
    id: 'p-6',
    name: 'Fajar Nugraha',
    ageBand: '25–34',
    domicile: 'Jakarta Pusat',
    occupation: 'Keuangan / Perbankan',
    currentBrand: 'Surya Nusantara',
    createdAt: '2026-11-10 14:52:00',
    sessionId: 's-6',
    totalScore: 91,
    isCompleted: true,
    completedAt: '2026-11-10 14:55:12',
  },
  {
    id: 'p-7',
    name: 'Gunawan Santoso',
    ageBand: '45+',
    domicile: 'Solo / Surakarta',
    occupation: 'Wirausaha / Pemilik Usaha',
    currentBrand: 'Gudang Garam Merah',
    createdAt: '2026-11-10 14:41:00',
    sessionId: 's-7',
    totalScore: 73,
    isCompleted: true,
    completedAt: '2026-11-10 14:44:05',
  },
  {
    id: 'p-8',
    name: 'Hendra Wijaya',
    ageBand: '25–34',
    domicile: 'Medan',
    occupation: 'Komersial / Penjualan',
    currentBrand: 'Surya 12',
    createdAt: '2026-11-10 14:28:00',
    sessionId: 's-8',
    totalScore: 84,
    isCompleted: true,
    completedAt: '2026-11-10 14:31:40',
  },
  {
    id: 'p-9',
    name: 'Indra Saputra',
    ageBand: '25–34',
    domicile: 'Makassar',
    occupation: 'Transportasi / Logistik',
    currentBrand: 'Surya Nusantara',
    createdAt: '2026-11-10 14:12:00',
    sessionId: 's-9',
    totalScore: 79,
    isCompleted: true,
    completedAt: '2026-11-10 14:15:55',
  },
  {
    id: 'p-10',
    name: 'Joko Susanto',
    ageBand: '35–44',
    domicile: 'Denpasar',
    occupation: 'Pariwisata / Perhotelan',
    currentBrand: 'Dji Sam Soe',
    createdAt: '2026-11-10 13:58:00',
    sessionId: 's-10',
    totalScore: 68,
    isCompleted: true,
    completedAt: '2026-11-10 14:01:20',
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
      inMemoryParticipants.unshift({
        id: participantId,
        name: String(name).trim(),
        ageBand: String(ageBand),
        domicile: String(domicile).trim(),
        occupation: String(occupation).trim(),
        currentBrand: String(currentBrand).trim(),
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
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

    // In-Memory Fallback untuk demo tanpa D1
    const totalParticipants = inMemoryParticipants.length;
    const completedList = inMemoryParticipants.filter((p) => p.isCompleted);
    const totalCompleted = completedList.length;
    const avgScore =
      totalCompleted > 0
        ? Number((completedList.reduce((acc, p) => acc + p.totalScore, 0) / totalCompleted).toFixed(1))
        : 0;
    const maxScore =
      totalCompleted > 0 ? Math.max(...completedList.map((p) => p.totalScore)) : 0;

    const distribution = {
      '0-20': completedList.filter((p) => p.totalScore >= 0 && p.totalScore <= 20).length,
      '21-40': completedList.filter((p) => p.totalScore >= 21 && p.totalScore <= 40).length,
      '41-60': completedList.filter((p) => p.totalScore >= 41 && p.totalScore <= 60).length,
      '61-80': completedList.filter((p) => p.totalScore >= 61 && p.totalScore <= 80).length,
      '81-100': completedList.filter((p) => p.totalScore >= 81 && p.totalScore <= 100).length,
    };

    // City counts
    const cityMap: Record<string, number> = {};
    inMemoryParticipants.forEach((p) => {
      cityMap[p.domicile] = (cityMap[p.domicile] || 0) + 1;
    });
    const topCities = Object.entries(cityMap)
      .map(([domicile, count]) => ({ domicile, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return c.json({
      success: true,
      stats: {
        totalParticipants,
        totalCompleted,
        averageScore: avgScore,
        maxScore,
        scoreDistribution: distribution,
        topCities,
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
    const db = getDb(c.env);

    if (db) {
      const mockData = [
        { name: 'Aditya Pratama', ageBand: '25–34', domicile: 'Surabaya', occ: 'Profesional / Karyawan Swasta', brand: 'Surya 12', score: 88 },
        { name: 'Bambang Sudiro', ageBand: '35–44', domicile: 'Semarang', occ: 'Wirausaha / Pemilik Usaha', brand: 'Surya PRO', score: 76 },
        { name: 'Cahyo Wibowo', ageBand: '25–34', domicile: 'Malang', occ: 'Industri Kreatif / Media', brand: 'Surya Nusantara', score: 94 },
        { name: 'Dimas Kurniawan', ageBand: '18–24', domicile: 'Yogyakarta', occ: 'Teknologi / IT', brand: 'Sampoerna A Mild', score: 65 },
        { name: 'Eko Prasetyo', ageBand: '35–44', domicile: 'Bandung', occ: 'Teknik / Konstruksi', brand: 'Djarum Super', score: 82 },
        { name: 'Fajar Nugraha', ageBand: '25–34', domicile: 'Jakarta', occ: 'Keuangan / Perbankan', brand: 'Surya Nusantara', score: 91 },
        { name: 'Gunawan Santoso', ageBand: '45+', domicile: 'Solo / Surakarta', occ: 'Wirausaha / Pemilik Usaha', brand: 'Gudang Garam Merah', score: 73 },
        { name: 'Hendra Wijaya', ageBand: '25–34', domicile: 'Medan', occ: 'Komersial / Penjualan', brand: 'Surya 12', score: 84 },
        { name: 'Indra Saputra', ageBand: '25–34', domicile: 'Makassar', occ: 'Transportasi / Logistik', brand: 'Surya Nusantara', score: 79 },
        { name: 'Joko Susanto', ageBand: '35–44', domicile: 'Denpasar', occ: 'Pariwisata / Perhotelan', brand: 'Dji Sam Soe', score: 68 },
      ];

      for (const item of mockData) {
        const partId = crypto.randomUUID();
        const sessId = crypto.randomUUID();

        await db.insert(participants).values({
          id: partId,
          name: item.name,
          ageBand: item.ageBand,
          isConfirmed21Plus: true,
          domicile: item.domicile,
          occupation: item.occ,
          currentBrand: item.brand,
        });

        await db.insert(quizSessions).values({
          id: sessId,
          participantId: partId,
          totalScore: item.score,
          isCompleted: true,
          completedAt: sql`CURRENT_TIMESTAMP`,
        });
      }
    } else {
      inMemoryParticipants = [...INITIAL_MOCK_PARTICIPANTS];
    }

    return c.json({ success: true, message: `Berhasil menyiapkan data simulasi kuis demo.` });
  } catch (err: any) {
    return c.json({ success: false, error: err?.message || 'Gagal seeding data' }, 500);
  }
});

export const onRequest = handle(app);
