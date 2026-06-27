export function parseParkingLocation(text: string): { location: string; floor: string } | null {
  const normalized = text.replace(/\s+/g, "");

  const explicitFloorMatch = normalized.match(/B(\d)\s*[-—–]?\s*([A-Za-z]?\d{1,3})/i);
  if (explicitFloorMatch) {
    const floor = `B${explicitFloorMatch[1]}`;
    const slot = explicitFloorMatch[2].toUpperCase();
    return { floor, location: `${floor}-${slot}` };
  }

  const implicitFloorMatch = normalized.match(/B\s*[-—–]\s*([A-Za-z]?\d{1,3})/i);
  if (implicitFloorMatch) {
    const floor = "B2";
    const slot = implicitFloorMatch[1].toUpperCase();
    return { floor, location: `${floor}-${slot}` };
  }

  const floorMatch = text.match(/地下(\d)\s*层/);
  if (floorMatch) {
    const colMatch = text.match(/([A-Za-z]\d{1,3}|\d{2,3}号?)/);
    const col = colMatch ? colMatch[1].toUpperCase() : "";
    return { floor: `B${floorMatch[1]}`, location: col ? `B${floorMatch[1]}-${col}` : `B${floorMatch[1]}` };
  }

  const stopMatch = text.match(/(?:停在|车在|停的?|车位)\s*([A-Za-z]?[-—–]?\d{1,3})/i);
  if (stopMatch) {
    const normalizedSlot = stopMatch[1].replace(/[-—–]/g, "").toUpperCase();
    return { floor: "B2", location: `B2-${normalizedSlot}` };
  }

  return null;
}

export function calcParkingDuration(parkedAt: number): string {
  const diffMs = Date.now() - parkedAt;
  const totalMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours === 0) return `${mins}分钟`;
  return `${hours}小时${mins}分钟`;
}

export function calcParkingFee(parkedAt: number): string {
  const diffMs = Date.now() - parkedAt;
  const totalMin = Math.max(1, Math.floor(diffMs / 60000));
  const freeMin = 30;
  if (totalMin <= freeMin) return "0";
  const billableMin = totalMin - freeMin;
  const fee = Math.ceil(billableMin / 60) * 15;
  return fee.toString();
}
