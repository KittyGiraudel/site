const jobHuntData = {
  total: 60,
  stages: [
    { id: 'no-interview', label: 'No interview', count: 47 },
    { id: 'one-interview', label: '1 interview', count: 3 },
    { id: 'two-interviews', label: '2 interviews', count: 5 },
    { id: 'three-interviews', label: '3 interviews', count: 5 },
  ],
  outcomes: [
    {
      id: 'immediate-rejection',
      label: 'Screened out',
      count: 33,
      stage: 'no-interview',
    },
    {
      id: 'ghosted',
      label: 'Never answered (ghosted)',
      count: 14,
      stage: 'no-interview',
    },
    {
      id: 'rejected-after-interview',
      label: 'Rejected after interview(s)',
      count: 13,
      stage: 'interview',
    },
  ],
};
