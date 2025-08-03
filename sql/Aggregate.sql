SELECT status,
       COUNT(*)  AS cnt,
       SUM(amount) AS total_amount
  FROM events
 WHERE event_date BETWEEN '2025-01-01' AND '2025-03-31'
 GROUP BY status