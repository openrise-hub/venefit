export const SET_TYPES = [
  {
    id: 'normal',
    name: 'Serie Normal / Estándar',
    short: 'Normal',
    desc: 'Serie de trabajo estándar con descanso completo.',
    color: 'default'
  },
  {
    id: 'superset',
    name: 'Superserie (2 ejercicios sin pausa)',
    short: 'Superserie',
    desc: 'Dos ejercicios consecutivos sin descanso intermedio.',
    color: 'primary'
  },
  {
    id: 'triset',
    name: 'Triserie (3 ejercicios sin pausa)',
    short: 'Triserie',
    desc: 'Tres ejercicios consecutivos sin descanso.',
    color: 'primary'
  },
  {
    id: 'giant_set',
    name: 'Serie Gigante / Multiserie (4+ ejercicios)',
    short: 'Multiserie',
    desc: '4 o más ejercicios consecutivos sin descanso para un grupo o circuito.',
    color: 'warning'
  },
  {
    id: 'dropset',
    name: 'Drop Set (Descendente al fallo)',
    short: 'Drop Set',
    desc: 'Llegar al fallo y reducir peso inmediatamente 20-30% para continuar.',
    color: 'danger'
  },
  {
    id: 'rest_pause',
    name: 'Rest-Pause (Pausa breve 10-15s)',
    short: 'Rest-Pause',
    desc: 'Pausa de 10-15s tras fallo y seguir con el mismo peso.',
    color: 'warning'
  },
  {
    id: 'myo_reps',
    name: 'Myo-Reps (Activación + minisets)',
    short: 'Myo-Reps',
    desc: 'Serie de activación + miniseries de 3-5 reps con micropausas de 5 respiraciones.',
    color: 'secondary'
  },
  {
    id: 'cluster',
    name: 'Cluster Set (Micropausas intra-serie)',
    short: 'Cluster',
    desc: 'Serie dividida en microbloques con pausas de 15-20s intra-serie.',
    color: 'secondary'
  },
  {
    id: 'top_set',
    name: 'Top Set (Serie pesada principal)',
    short: 'Top Set',
    desc: 'La serie de mayor carga e intensidad de la sesión.',
    color: 'danger'
  },
  {
    id: 'backoff',
    name: 'Back-off Set (Volumen con carga reducida)',
    short: 'Back-off',
    desc: 'Serie posterior al Top Set con 10-20% menos peso para acumular volumen.',
    color: 'default'
  },
  {
    id: 'warmup',
    name: 'Calentamiento (Sin fatiga)',
    short: 'Calentamiento',
    desc: 'Preparación neuromuscular sin llegar a fatiga.',
    color: 'default'
  },
  {
    id: 'feeder',
    name: 'Aproximación / Feeder Set',
    short: 'Aproximación',
    desc: 'Poco volumen para calibrar sensaciones antes de las series pesadas.',
    color: 'default'
  }
] as const;

export type SetTypeId = typeof SET_TYPES[number]['id'];

export function getSetTypeInfo(typeId?: string) {
  const found = SET_TYPES.find(s => s.id === typeId);
  return found || SET_TYPES[0];
}
