import { Resend } from "resend";
import { formatDate, formatTime } from "@/lib/utils";
import { TIME_SLOT_LABELS as KT_TIME_SLOT_LABELS } from "@/lib/killteam";
import { TIME_SLOT_LABELS } from "@/lib/mtg";
import { TIME_SLOT_LABELS as OPEN_PLAY_TIME_SLOT_LABELS } from "@/lib/openplay";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function siteBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    ""
  );
}

async function sendMail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set; skipping send");
    return;
  }
  const from =
    process.env.EMAIL_FROM?.trim() ?? "Warehouse 41 <onboarding@resend.dev>";
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
  if (error) {
    console.error("[email] Resend error:", error);
  }
}

/** Fire-and-forget safe wrapper: logs errors, never throws. */
export function queueSessionBookingConfirmation(args: {
  to: string;
  customerName: string;
  sessionTitle: string;
  sessionDate: Date;
  seats: number;
}): void {
  void sendSessionBookingConfirmation(args).catch((e) =>
    console.error("[email] session booking", e)
  );
}

async function sendSessionBookingConfirmation(args: {
  to: string;
  customerName: string;
  sessionTitle: string;
  sessionDate: Date;
  seats: number;
}): Promise<void> {
  const when = `${formatDate(args.sessionDate)} at ${formatTime(args.sessionDate)}`;
  const subject = `Booking confirmed: ${args.sessionTitle}`;
  const html = `
    <p>Hi ${escapeHtml(args.customerName)},</p>
    <p>Your session booking at <strong>Warehouse 41</strong> is confirmed.</p>
    <ul>
      <li><strong>Session:</strong> ${escapeHtml(args.sessionTitle)}</li>
      <li><strong>When:</strong> ${escapeHtml(when)}</li>
      <li><strong>Seats:</strong> ${args.seats}</li>
    </ul>
    <p>Payment status: pending (pay in store unless you arranged otherwise).</p>
    ${footerHtml()}
  `.trim();
  const text = [
    `Hi ${args.customerName},`,
    "",
    `Your session booking at Warehouse 41 is confirmed.`,
    `Session: ${args.sessionTitle}`,
    `When: ${when}`,
    `Seats: ${args.seats}`,
    "",
    "Payment status: pending (pay in store unless you arranged otherwise).",
    "",
    footerText(),
  ].join("\n");
  await sendMail({ to: args.to, subject, html, text });
}

export function queueMTGBookingConfirmation(args: {
  to: string;
  customerName: string;
  date: Date;
  timeSlot: string;
}): void {
  void sendMTGBookingConfirmation(args).catch((e) =>
    console.error("[email] MTG booking", e)
  );
}

async function sendMTGBookingConfirmation(args: {
  to: string;
  customerName: string;
  date: Date;
  timeSlot: string;
}): Promise<void> {
  const slotLabel = TIME_SLOT_LABELS[args.timeSlot] ?? args.timeSlot;
  const day = formatDate(args.date);
  const subject = `MTG table booking confirmed — ${day}`;
  const html = `
    <p>Hi ${escapeHtml(args.customerName)},</p>
    <p>Your <strong>Magic: The Gathering</strong> table booking at Warehouse 41 is confirmed.</p>
    <ul>
      <li><strong>Date:</strong> ${escapeHtml(day)}</li>
      <li><strong>Time slot:</strong> ${escapeHtml(slotLabel)}</li>
    </ul>
    <p>See you at the store. Pay in store per posted rates.</p>
    ${footerHtml()}
  `.trim();
  const text = [
    `Hi ${args.customerName},`,
    "",
    "Your MTG table booking at Warehouse 41 is confirmed.",
    `Date: ${day}`,
    `Time slot: ${slotLabel}`,
    "",
    "Pay in store per posted rates.",
    "",
    footerText(),
  ].join("\n");
  await sendMail({ to: args.to, subject, html, text });
}

export function queueOpenPlayBookingConfirmation(args: {
  to: string;
  customerName: string;
  date: Date;
  timeSlot: string;
}): void {
  void sendOpenPlayBookingConfirmation(args).catch((e) =>
    console.error("[email] open play booking", e)
  );
}

async function sendOpenPlayBookingConfirmation(args: {
  to: string;
  customerName: string;
  date: Date;
  timeSlot: string;
}): Promise<void> {
  const slotLabel = OPEN_PLAY_TIME_SLOT_LABELS[args.timeSlot] ?? args.timeSlot;
  const day = formatDate(args.date);
  const subject = `Open play table booking confirmed — ${day}`;
  const html = `
    <p>Hi ${escapeHtml(args.customerName)},</p>
    <p>Your <strong>open play</strong> table booking at Warehouse 41 is confirmed.</p>
    <ul>
      <li><strong>Date:</strong> ${escapeHtml(day)}</li>
      <li><strong>Time slot:</strong> ${escapeHtml(slotLabel)}</li>
    </ul>
    <p>Bring whatever you like to play. See you at the store — pay in store per posted rates.</p>
    ${footerHtml()}
  `.trim();
  const text = [
    `Hi ${args.customerName},`,
    "",
    "Your open play table booking at Warehouse 41 is confirmed.",
    `Date: ${day}`,
    `Time slot: ${slotLabel}`,
    "",
    "Bring whatever you like to play. Pay in store per posted rates.",
    "",
    footerText(),
  ].join("\n");
  await sendMail({ to: args.to, subject, html, text });
}

export function queueKillTeamBookingConfirmation(args: {
  to: string;
  customerName: string;
  date: Date;
  timeSlot: string;
  terrain: string;
  teamsJson: string;
}): void {
  void sendKillTeamBookingConfirmation(args).catch((e) =>
    console.error("[email] Kill Team booking", e)
  );
}

async function sendKillTeamBookingConfirmation(args: {
  to: string;
  customerName: string;
  date: Date;
  timeSlot: string;
  terrain: string;
  teamsJson: string;
}): Promise<void> {
  let teamsLine = "—";
  try {
    const parsed = JSON.parse(args.teamsJson) as unknown;
    if (Array.isArray(parsed)) {
      teamsLine = parsed.join(", ");
    } else if (typeof parsed === "string") {
      teamsLine = parsed;
    }
  } catch {
    teamsLine = args.teamsJson;
  }
  const slotLabel = KT_TIME_SLOT_LABELS[args.timeSlot] ?? args.timeSlot;
  const day = formatDate(args.date);
  const subject = `Kill Team table booking confirmed — ${day}`;
  const html = `
    <p>Hi ${escapeHtml(args.customerName)},</p>
    <p>Your <strong>Kill Team</strong> table booking at Warehouse 41 is confirmed.</p>
    <ul>
      <li><strong>Date:</strong> ${escapeHtml(day)}</li>
      <li><strong>Time slot:</strong> ${escapeHtml(slotLabel)}</li>
      <li><strong>Terrain:</strong> ${escapeHtml(args.terrain)}</li>
      <li><strong>Teams:</strong> ${escapeHtml(teamsLine)}</li>
    </ul>
    <p>Pay in store per posted rates.</p>
    ${footerHtml()}
  `.trim();
  const text = [
    `Hi ${args.customerName},`,
    "",
    "Your Kill Team table booking at Warehouse 41 is confirmed.",
    `Date: ${day}`,
    `Time slot: ${slotLabel}`,
    `Terrain: ${args.terrain}`,
    `Teams: ${teamsLine}`,
    "",
    "Pay in store per posted rates.",
    "",
    footerText(),
  ].join("\n");
  await sendMail({ to: args.to, subject, html, text });
}

function footerHtml(): string {
  const base = siteBaseUrl();
  if (!base) {
    return `<p style="color:#666;font-size:12px;margin-top:24px;">Warehouse 41</p>`;
  }
  return `<p style="color:#666;font-size:12px;margin-top:24px;"><a href="${escapeHtml(base)}">Warehouse 41</a></p>`;
}

function footerText(): string {
  const base = siteBaseUrl();
  return base ? `Warehouse 41 — ${base}` : "Warehouse 41";
}
