import styles from './Pagination.module.css';

export function Pagination({ page, pageSize, total, setPage }) {
  const totalPages = Math.ceil(total / pageSize) || 1;
  
  if (totalPages <= 1) return null;
  
  return (
    <div className={styles.pagination}>
      <button 
        className={styles.btn} 
        disabled={page <= 1} 
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>
      <span className={styles.indicator}>Page {page} of {totalPages}</span>
      <button 
        className={styles.btn} 
        disabled={page >= totalPages} 
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
