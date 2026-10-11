/**
 * Chuyen doi gio Asia/Ho_Chi_Minh. HCM la UTC+7 co dinh, khong co DST, nen
 * offset luon la +07:00. Dung chung o form dan xuat session.
 */
const HCM_UTC_OFFSET_MINUTES = 7 * 60;

/**
 * Chuyen gia tri input datetime-local (vd "2024-05-01T09:00"), hieu theo gio
 * HCM, thanh instant ISO-8601 UTC (vd "2024-05-01T02:00:00.000Z").
 * Tra null khi chuoi rong hoac khong hop le.
 */
export function hcmLocalInputToIso(localValue: string): string | null {
  const match = localValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute) - HCM_UTC_OFFSET_MINUTES * 60_000;
  const date = new Date(utcMillis);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}
