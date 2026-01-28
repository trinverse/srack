import { NextRequest, NextResponse } from 'next/server';

// ANSI color codes for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

const levelColors: Record<string, string> = {
  debug: colors.gray,
  info: colors.cyan,
  warn: colors.yellow,
  error: colors.red,
  log: colors.white,
};

const levelIcons: Record<string, string> = {
  debug: '🔍',
  info: 'ℹ️ ',
  warn: '⚠️ ',
  error: '❌',
  log: '📝',
};

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  try {
    const { level, args, timestamp, source } = await request.json();

    const color = levelColors[level] || colors.white;
    const icon = levelIcons[level] || '•';
    const time = new Date(timestamp).toLocaleTimeString();

    // Format the log message
    const prefix = `${colors.dim}${time}${colors.reset} ${icon} ${color}[CLIENT${source ? `:${source}` : ''}]${colors.reset}`;

    // Convert args to printable format
    const formattedArgs = args.map((arg: unknown) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg, null, 2);
      }
      return String(arg);
    });

    console.log(prefix, ...formattedArgs);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
