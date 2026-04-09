import pymysql
import pymysql.cursors
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME


def get_db():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
        charset="utf8mb4",
        autocommit=False
    )


def db_query(sql, params=(), fetchone=False, fetchall=False, commit=False):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        result = None
        if fetchone: result = cur.fetchone()
        if fetchall: result = cur.fetchall()
        if commit:   conn.commit()
        return result
    finally:
        conn.close()


def db_insert(sql, params, table):
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        new_id = cur.lastrowid
        conn.commit()
        cur.execute(f'SELECT * FROM `{table}` WHERE id=%s', (new_id,))
        return cur.fetchone()
    finally:
        conn.close()


def init_db():
    conn = get_db()
    cur  = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        phone         VARCHAR(30),
        password_hash TEXT NOT NULL,
        name          VARCHAR(255),
        role          VARCHAR(20) DEFAULT 'student',
        grade         VARCHAR(100),
        wilaya        VARCHAR(100),
        university    VARCHAR(255),
        speciality    VARCHAR(255),
        bio           TEXT,
        skills        TEXT,
        avatar_url    TEXT,
        verified      TINYINT(1) DEFAULT 0,
        is_banned     TINYINT(1) DEFAULT 0,
        ban_reason    TEXT,
        otp           VARCHAR(10),
        otp_expires   DATETIME,
        refresh_token TEXT,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        employer_id     INT,
        title           VARCHAR(255) NOT NULL,
        description     TEXT,
        category        VARCHAR(100),
        wilaya          VARCHAR(100),
        work_type       VARCHAR(50) DEFAULT 'partial',
        daily_salary    DECIMAL(10,2),
        required_skills TEXT,
        status          VARCHAR(20) DEFAULT 'open',
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        job_id       INT,
        student_id   INT,
        status       VARCHAR(30) DEFAULT 'pending',
        cover_letter TEXT,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_app (job_id, student_id),
        FOREIGN KEY (job_id)     REFERENCES jobs(id)  ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        employer_id INT,
        student_id  INT,
        job_id      INT,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employer_id) REFERENCES users(id),
        FOREIGN KEY (student_id)  REFERENCES users(id),
        FOREIGN KEY (job_id)      REFERENCES jobs(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT,
        sender_id       INT,
        content         TEXT,
        msg_type        VARCHAR(30) DEFAULT 'text',
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id)       REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS deals (
        id                 INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id    INT,
        employer_id        INT,
        student_id         INT,
        daily_salary       DECIMAL(10,2) DEFAULT 1000,
        duration_months    INT DEFAULT 1,
        start_date         DATE,
        payment_date       INT DEFAULT 15,
        instructions       TEXT,
        status             VARCHAR(40) DEFAULT 'idle',
        employer_confirmed TINYINT(1) DEFAULT 0,
        student_confirmed  TINYINT(1) DEFAULT 0,
        deposit_deadline   DATETIME,
        created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (employer_id)     REFERENCES users(id),
        FOREIGN KEY (student_id)      REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        deal_id      INT,
        month_number INT NOT NULL,
        amount       DECIMAL(10,2),
        fee          DECIMAL(10,2),
        status       VARCHAR(30) DEFAULT 'pending',
        paid_at      DATETIME,
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS ratings (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        deal_id    INT,
        rater_id   INT,
        rated_id   INT,
        score      SMALLINT NOT NULL,
        comment    TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_rating (deal_id, rater_id),
        FOREIGN KEY (deal_id)  REFERENCES deals(id) ON DELETE CASCADE,
        FOREIGN KEY (rater_id) REFERENCES users(id),
        FOREIGN KEY (rated_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS demands (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        student_id       INT NOT NULL,
        title            VARCHAR(255) NOT NULL,
        description      TEXT,
        category         VARCHAR(100),
        wilaya           VARCHAR(100),
        available_hours  VARCHAR(50),
        expected_salary  DECIMAL(10,2),
        skills           TEXT,
        status           VARCHAR(20) DEFAULT 'open',
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    """)

    for col_sql in [
        "ALTER TABLE users ADD COLUMN is_banned TINYINT(1) DEFAULT 0",
        "ALTER TABLE users ADD COLUMN ban_reason TEXT",
    ]:
        try:
            cur.execute(col_sql)
            conn.commit()
        except pymysql.err.OperationalError:
            pass

    conn.commit()
    conn.close()
    print("✅ Database schema ready.")
