export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const USER_ROLES = {
  HO: 'ho',
  OUTLET: 'outlet'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped'
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800'
};

export const ORDER_STATUS_LABELS = {
  pending: 'Menunggu',
  paid: 'Dibayar',
  shipped: 'Dikirim'
};