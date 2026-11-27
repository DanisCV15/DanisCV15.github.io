// Técnicas de MITRE ATT&CK (Enterprise) que aparecen en los laboratorios.
// Nombre oficial en inglés, como en attack.mitre.org, y la táctica con la que se usa aquí.
// Para añadir una técnica nueva a un laboratorio, primero hay que darla de alta aquí.

export const TACTICS = [
  { id: 'TA0043', nombre: 'Reconocimiento' },
  { id: 'TA0001', nombre: 'Acceso inicial' },
  { id: 'TA0002', nombre: 'Ejecución' },
  { id: 'TA0003', nombre: 'Persistencia' },
  { id: 'TA0004', nombre: 'Escalada de privilegios' },
  { id: 'TA0006', nombre: 'Acceso a credenciales' },
  { id: 'TA0007', nombre: 'Descubrimiento' },
  { id: 'TA0008', nombre: 'Movimiento lateral' },
  { id: 'TA0011', nombre: 'Mando y control' },
] as const;

export type TacticId = (typeof TACTICS)[number]['id'];

export const TECHNIQUES: Record<string, { nombre: string; tactica: TacticId }> = {
  'T1595': { nombre: 'Active Scanning', tactica: 'TA0043' },
  'T1595.003': { nombre: 'Wordlist Scanning', tactica: 'TA0043' },
  'T1590.002': { nombre: 'Gather Victim Network Information: DNS', tactica: 'TA0043' },
  'T1594': { nombre: 'Search Victim-Owned Websites', tactica: 'TA0043' },

  'T1190': { nombre: 'Exploit Public-Facing Application', tactica: 'TA0001' },
  'T1078': { nombre: 'Valid Accounts', tactica: 'TA0001' },
  'T1078.001': { nombre: 'Default Accounts', tactica: 'TA0001' },
  'T1566.002': { nombre: 'Spearphishing Link', tactica: 'TA0001' },

  'T1059.004': { nombre: 'Unix Shell', tactica: 'TA0002' },
  'T1059.006': { nombre: 'Python', tactica: 'TA0002' },
  'T1059.007': { nombre: 'JavaScript', tactica: 'TA0002' },

  'T1505.003': { nombre: 'Web Shell', tactica: 'TA0003' },
  'T1136.001': { nombre: 'Create Account: Local Account', tactica: 'TA0003' },
  'T1098.004': { nombre: 'SSH Authorized Keys', tactica: 'TA0003' },

  'T1548': { nombre: 'Abuse Elevation Control Mechanism', tactica: 'TA0004' },
  'T1548.001': { nombre: 'Setuid and Setgid', tactica: 'TA0004' },
  'T1548.003': { nombre: 'Sudo and Sudo Caching', tactica: 'TA0004' },
  'T1068': { nombre: 'Exploitation for Privilege Escalation', tactica: 'TA0004' },
  'T1134.001': { nombre: 'Token Impersonation/Theft', tactica: 'TA0004' },
  'T1574': { nombre: 'Hijack Execution Flow', tactica: 'TA0004' },
  'T1543.003': { nombre: 'Windows Service', tactica: 'TA0004' },
  'T1611': { nombre: 'Escape to Host', tactica: 'TA0004' },

  'T1552': { nombre: 'Unsecured Credentials', tactica: 'TA0006' },
  'T1552.001': { nombre: 'Credentials In Files', tactica: 'TA0006' },
  'T1552.004': { nombre: 'Private Keys', tactica: 'TA0006' },
  'T1555.005': { nombre: 'Password Managers', tactica: 'TA0006' },
  'T1110.001': { nombre: 'Password Guessing', tactica: 'TA0006' },
  'T1110.002': { nombre: 'Password Cracking', tactica: 'TA0006' },
  'T1539': { nombre: 'Steal Web Session Cookie', tactica: 'TA0006' },

  'T1083': { nombre: 'File and Directory Discovery', tactica: 'TA0007' },
  'T1082': { nombre: 'System Information Discovery', tactica: 'TA0007' },
  'T1033': { nombre: 'System Owner/User Discovery', tactica: 'TA0007' },
  'T1518.001': { nombre: 'Security Software Discovery', tactica: 'TA0007' },

  'T1021.004': { nombre: 'Remote Services: SSH', tactica: 'TA0008' },
  'T1021.006': { nombre: 'Windows Remote Management', tactica: 'TA0008' },

  'T1105': { nombre: 'Ingress Tool Transfer', tactica: 'TA0011' },
};

export const techniqueUrl = (id: string) => `https://attack.mitre.org/techniques/${id.replace('.', '/')}/`;
export const tacticName = (id: TacticId) => TACTICS.find((t) => t.id === id)!.nombre;
