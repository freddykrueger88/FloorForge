/**
 * anonymizeIp – DSGVO: IP-Adressen in Logs anonymisieren (Issue #20)
 * IPv4: letztes Oktett kappen. IPv6: nur die ersten 48 Bit (3 Gruppen)
 * behalten. Loopback bleibt unverändert (keine personenbezogene Adresse).
 */
export function anonymizeIp(ip) {
  if (!ip) return ip;
  if (ip === '::1' || ip === '127.0.0.1') return ip;

  const v4Mapped = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(ip);
  const v4 = v4Mapped ? v4Mapped[1] : ip;
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v4)) {
    return v4.replace(/\.\d{1,3}$/, '.0');
  }

  if (ip.includes(':')) {
    const groups = ip.split(':').filter(Boolean);
    return `${groups.slice(0, 3).join(':')}::`;
  }

  return ip;
}
