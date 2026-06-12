/* StatusBadge — mapping interne status → variant du MetabletonBadge. */
import React from 'react';
import MetabletonBadge from '../../primitives/MetabletonBadge.jsx';

const STATUS_VARIANT = {
  'Rendu':     'green',
  'En cours':  'orange',
  'En attente':'orange',
  'Non rendu': 'danger',
  'Retard':    'danger',
  'default':   'default',
};

export default function StatusBadge({ status }) {
  const variant = STATUS_VARIANT[status] || STATUS_VARIANT.default;
  return <MetabletonBadge variant={variant}>{status}</MetabletonBadge>;
}
