import React, { useContext } from 'react';
import { BookContext } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import styles from './Stats.module.css';

// Komponen untuk chart progress lingkaran
const CircleProgress = ({ percentage, color, status }) => {
  const circumference = 2 * Math.PI * 45; // r = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={styles.circleContainer}>
      <svg width="120" height="120" viewBox="0 0 120 120" className={styles.circle}>
        <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle 
          cx="60" 
          cy="60" 
          r="45" 
          fill="none" 
          stroke={color} 
          strokeWidth="10" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className={styles.circleProgress}
        />
        <text x="60" y="60" textAnchor="middle" dy="0.3em" className={styles.circleText}>
          {percentage}%
        </text>
      </svg>
      <div className={styles.circleLabel}>{status}</div>
    </div>
  );
};

const Stats = () => {
  const stats = useBookStats();
  const { books } = useContext(BookContext);
  
  if (!books || books.length === 0) {
    return (
      <div className={styles.statsPage}>
        <h2>Statistik Buku</h2>
        <div className={styles.emptyState}>
          <p>Tambahkan beberapa buku untuk melihat statistik di sini!</p>
          <button className={styles.addBookButton} onClick={() => window.location.href = '/'}>
            Tambah Buku Sekarang
          </button>
        </div>
      </div>
    );
  }

  // Menghitung persentase untuk setiap status
  const dimilikiPercentage = stats.total > 0 ? Math.round((stats.byStatus.dimiliki / stats.total) * 100) : 0;
  const dibacaPercentage = stats.total > 0 ? Math.round((stats.byStatus.dibaca / stats.total) * 100) : 0;
  const dibeliPercentage = stats.total > 0 ? Math.round((stats.byStatus.dibeli / stats.total) * 100) : 0;

  return (
    <div className={styles.statsPage}>
      <div className={styles.statsHeader}>
        <h2>Statistik Buku</h2>
        <div className={styles.totalBooks}>
          <span className={styles.totalBookCount}>{stats.total}</span> 
          <span className={styles.totalBookLabel}>Total Buku</span>
        </div>
      </div>

      <div className={styles.statsSummary}>
        <div className={styles.progressCharts}>
          <CircleProgress 
            percentage={dimilikiPercentage} 
            color="#3182ce" 
            status="Dimiliki"
          />
          <CircleProgress 
            percentage={dibacaPercentage} 
            color="#38a169" 
            status="Sedang Dibaca"
          />
          <CircleProgress 
            percentage={dibeliPercentage} 
            color="#d69e2e" 
            status="Ingin Dibeli"
          />
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(49, 130, 206, 0.1)' }}>
              <span>📚</span>
            </div>
            <div className={styles.statInfo}>
              <h3>Buku Dimiliki</h3>
              <div className={styles.statNumber}>{stats.byStatus.dimiliki}</div>
              <div className={styles.statPercentage} style={{ color: '#3182ce' }}>
                {dimilikiPercentage}% dari total
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(56, 161, 105, 0.1)' }}>
              <span>📖</span>
            </div>
            <div className={styles.statInfo}>
              <h3>Sedang Dibaca</h3>
              <div className={styles.statNumber}>{stats.byStatus.dibaca}</div>
              <div className={styles.statPercentage} style={{ color: '#38a169' }}>
                {dibacaPercentage}% dari total
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: 'rgba(214, 158, 46, 0.1)' }}>
              <span>🛒</span>
            </div>
            <div className={styles.statInfo}>
              <h3>Ingin Dibeli</h3>
              <div className={styles.statNumber}>{stats.byStatus.dibeli}</div>
              <div className={styles.statPercentage} style={{ color: '#d69e2e' }}>
                {dibeliPercentage}% dari total
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats.topAuthors.length > 0 && (
        <div className={styles.authorsSection}>
          <h3>Penulis Terpopuler</h3>
          <div className={styles.authorChartContainer}>
            <div className={styles.authorChart}>
              {stats.topAuthors.map((author, index) => {
                const barWidth = `${(author.count / stats.topAuthors[0].count) * 100}%`;
                return (
                  <div key={author.author} className={styles.authorBar}>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorRank}>{index + 1}</span>
                      <span className={styles.authorName}>{author.author}</span>
                    </div>
                    <div className={styles.barContainer}>
                      <div 
                        className={styles.barFill} 
                        style={{ width: barWidth }}
                      ></div>
                      <span className={styles.authorCount}>
                        {author.count} {author.count === 1 ? 'buku' : 'buku'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.tipSection}>
        <h3>Tips Manajemen Buku</h3>
        <div className={styles.tips}>
          <div className={styles.tip}>
            <div className={styles.tipIcon}>💡</div>
            <div className={styles.tipContent}>
              <h4>Atur Prioritas Bacaan</h4>
              <p>Tambahkan buku yang ingin Anda baca segera ke kategori "Sedang Dibaca" untuk mengingatkan Anda.</p>
            </div>
          </div>
          <div className={styles.tip}>
            <div className={styles.tipIcon}>🔍</div>
            <div className={styles.tipContent}>
              <h4>Gunakan Pencarian</h4>
              <p>Manfaatkan fitur pencarian untuk menemukan buku dengan cepat saat koleksi Anda bertambah banyak.</p>
            </div>
          </div>
          <div className={styles.tip}>
            <div className={styles.tipIcon}>🔄</div>
            <div className={styles.tipContent}>
              <h4>Perbarui Status Buku</h4>
              <p>Jangan lupa memperbarui status buku dari "Ingin Dibeli" menjadi "Dimiliki" setelah Anda membelinya.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
