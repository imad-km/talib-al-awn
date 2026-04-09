import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WILAYAS = [
  { code: '01', name: 'Adrar', communes: ['Adrar','Tamest','Charouine','Reggane','In Zghmir','Tit','Ksar Kaddour','Tsabit','Timimoun','Ouled Said','Zaouiet Kounta','Aoulef','Timokten','Tamentit','Fenoughil','Tinerkouk'] },
  { code: '02', name: 'Chlef', communes: ['Chlef','Tenes','Benairia','El Karimia','Tadjena','Taougrite','Beni Haoua','Sobha','Harchoun','Ouled Fares','Sidi Akkacha','Boukadir','Beni Rached','Talassa','Herenfa','Oued Goussine','Dahra','Ouled Abbes','Sendjas','Zeboudja','Oum Drou','Breira','Abou El Hassen','El Marsa','Chettia','Sidi Abderrahmane','Moussadek','El Hadjadj','Labiod Medjadja','Oued Sly','Bouzeghaia','Ain Merane','Oued Fodda','Ouled Ben Abdelkader','El Harch'] },
  { code: '03', name: 'Laghouat', communes: ['Laghouat','Ksar El Hirane','Benacer Benchohra','Sidi Makhlouf','Hassi Delaa','Hassi R\'mel','Ain Madhi','Tadjmout','Kheneg','Gueltet Sidi Saad','Aflou','El Assafia','Oued Morra','Oued M\'zi','El Houaita','Sidi Bouzid'] },
  { code: '04', name: 'Oum El Bouaghi', communes: ['Oum El Bouaghi','Ain Beida','Ain M\'lila','Behir Chergui','El Amiria','Sigus','El Belala','Ain Babouche','Berriche','Ouled Hamla','Dhala','Ain Kercha','Hanchir Toumghani','El Djazia','Aïn Zitoun','Bir Chouhada','Souk Naamane','Zorga','El Fedjoudj','Ouled Gacem','Fkirina','Ksar Sbahi','Aïn Diss','Ouled Zouai','Meskiana','Aïn Fakroun','Rahia'] },
  { code: '05', name: 'Batna', communes: ['Batna','Ghassira','Maafa','Merouana','Seriana','Menaa','El Madher','Tazoult','N\'Gaous','Guigba','Inoughissen','Ouyoun El Assafir','Djerma','Bitam','Metkaouak','Arris','Kimmel','Tilatou','Ain Djasser','Ouled Si Slimane','Tigherghar','Ain Yagout','Fesdis','Sefiane','Rahbat','Tighanimine','Lemcene','Ksar Bellezma','Seggana','Ichmoul','Foum Toub','Ben Foudhala El Hakania','Oued El Ma','Talkhamt','Boumia','Boulhilat','Larbaa','Hidoussa','Taxlent','Gosbat','Ouled Aouf','Timgad','Ras El Aioun','Chir','Ouled Fadel'] },
  { code: '06', name: 'Béjaïa', communes: ['Béjaïa','Amizour','Ferraoun','Taourirt Ighil','Chemini','Souk El Thenine','M\'cisna','Tichy','Semaoun','Kendira','Tifra','Ighram','Amalou','Ighil Ali','Fenaia Ilmaten','Toudja','Darguina','Sidi Ayad','Aokas','Beni Djellil','Adekar','Akbou','Seddouk','Tazmalt','Ait Rzine','Chellata','Tamokra','Timzrit','Souk Oufella','Taskriout','Tibane','Beni Ksila'] },
  { code: '07', name: 'Biskra', communes: ['Biskra','Oumache','Branis','Chetma','Sidi Okba','M\'Chouneche','El Haouch','Ain Naga','Zeribet El Oued','El Feidh','El Kantara','Ain Zaatout','El Outaya','Djemorah','Tolga','Lioua','Lichana','Ouled Djellal'] },
  { code: '08', name: 'Béchar', communes: ['Béchar','Erg Ferradj','Ouled Khoudir','Meridja','Timoudi','Lahmar','Béni Abbès','Kenadsa','Igli','Taghit','El Ouata','Boukais','Mogheul'] },
  { code: '09', name: 'Blida', communes: ['Blida','Chebli','Bouinan','Oued El Alleug','Ouled Yaich','Chrea','El Affroun','Chiffa','Hammam Melouane','Benkhelil','Soumaa','Mouzaia','Souhane','Meftah','Ouled Slama','Boufarik','Larbaa','Guerouaou'] },
  { code: '10', name: 'Bouira', communes: ['Bouira','Sour El Ghozlane','Dechmia','Ridane','Haizer','Lakhdaria','Maala','El Hachimia','Aomar','Chorfa','Beni Mansour','M\'Chedallah','Saharidj','Taghzout','Ahl El Ksar','El Adjiba','Bechloul','Ath Mansour','Bir Ghbalou'] },
  { code: '11', name: 'Tamanrasset', communes: ['Tamanrasset','Abalessa','In Ghar','In Salah','Tin Zaouatine'] },
  { code: '12', name: 'Tébessa', communes: ['Tébessa','Bir El Ater','Cheria','Stah Guentis','El Aouinet','Lakhouat','El Ma Labiodh','Negrine','Hammamet','Ouenza','Bir Mokadem'] },
  { code: '13', name: 'Tlemcen', communes: ['Tlemcen','Beni Mester','Aïn Tallout','Remchi','El Fehoul','Sabra','Ghazaouet','Souani','Nedroma','Maghnia','Hennaya','Bensekrane'] },
  { code: '14', name: 'Tiaret', communes: ['Tiaret','Medroussa','Aïn Bouchekif','Sidi Ali Mellal','Meghila','Tousnina','Frenda','Dahmouni'] },
  { code: '15', name: 'Tizi Ouzou', communes: ['Tizi Ouzou','Aïn El Hammam','Akbil','Freha','Souamaa','Mechtras','Irdjen','Timizart'] },
  { code: '16', name: 'Alger', communes: ['Alger','Sidi M\'Hamed','El Madania','Belouizdad','Bab El Oued','Bologhine','Casbah','Oued Koriche'] },
  { code: '17', name: 'Djelfa', communes: ['Djelfa','Moudjebara','El Idrissia','Hassi Bahbah','Aïn Oussera','Dar Chioukh'] },
  { code: '18', name: 'Jijel', communes: ['Jijel','El Aouana','Ziama Mansouriah','Taher','Emir Abdelkader'] },
  { code: '19', name: 'Sétif', communes: ['Sétif','Aïn El Kebira','Beni Aziz','El Eulma','Aïn Oulmene'] },
  { code: '20', name: 'Saïda', communes: ['Saïda','Doui Thabet','Aïn El Hadjar','Youb'] },
  { code: '21', name: 'Skikda', communes: ['Skikda','Azzaba','El Harrouch','Collo'] },
  { code: '22', name: 'Sidi Bel Abbès', communes: ['Sidi Bel Abbès','Tessala','Sfisef','Telagh'] },
  { code: '23', name: 'Annaba', communes: ['Annaba','El Hadjar','Berrahal','Seraidi'] },
  { code: '24', name: 'Guelma', communes: ['Guelma','Bouchegouf','Oued Zenati','Héliopolis'] },
  { code: '25', name: 'Constantine', communes: ['Constantine','El Khroub','Hamma Bouziane','Didouche Mourad'] },
  { code: '26', name: 'Médéa', communes: ['Médéa','Berrouaghia','Ksar El Boukhari','Ouzera'] },
  { code: '27', name: 'Mostaganem', communes: ['Mostaganem','Aïn Tedeles','Sidi Ali','Hassi Mameche'] },
  { code: '28', name: 'M\'Sila', communes: ['M\'Sila','Bou Saada','Magra','Hammam Dalaa'] },
  { code: '29', name: 'Mascara', communes: ['Mascara','Tighennif','Sig','Mohammadia'] },
  { code: '30', name: 'Ouargla', communes: ['Ouargla','Hassi Messaoud','Touggourt','N\'Goussa'] },
  { code: '31', name: 'Oran', communes: ['Oran','Es Senia','Bir El Djir','Arzew'] },
  { code: '32', name: 'El Bayadh', communes: ['El Bayadh','Bougtob','Rogassa','Brezina'] },
  { code: '33', name: 'Illizi', communes: ['Illizi','Djanet','Bordj Omar Driss','In Amenas'] },
  { code: '34', name: 'Bordj Bou Arréridj', communes: ['Bordj Bou Arréridj','Ras El Oued','Medjana','Mansoura'] },
  { code: '35', name: 'Boumerdès', communes: ['Boumerdès','Boudouaou','Dellys','Khemis El Khechna'] },
  { code: '36', name: 'El Tarf', communes: ['El Tarf','Ben M\'Hidi','Bouteldja','El Kala'] },
  { code: '37', name: 'Tindouf', communes: ['Tindouf','Oum El Assel'] },
  { code: '38', name: 'Tissemsilt', communes: ['Tissemsilt','Bordj Bounaama','Lardjem'] },
  { code: '39', name: 'El Oued', communes: ['El Oued','Robbah','Guemar','Debila'] },
  { code: '40', name: 'Khenchela', communes: ['Khenchela','Chechar','Kaïs','Aïn Touila'] },
  { code: '41', name: 'Souk Ahras', communes: ['Souk Ahras','Sedrata','M\'Daourouch'] },
  { code: '42', name: 'Tipaza', communes: ['Tipaza','Cherchell','Hadjout'] },
  { code: '43', name: 'Mila', communes: ['Mila','Chelghoum Laid','Ferdjioua'] },
  { code: '44', name: 'Aïn Defla', communes: ['Aïn Defla','Khemis Miliana','Djendel'] },
  { code: '45', name: 'Naâma', communes: ['Naâma','Mécheria','Aïn Sefra'] },
  { code: '46', name: 'Aïn Témouchent', communes: ['Aïn Témouchent','Hammam Bou Hadjar'] },
  { code: '47', name: 'Ghardaïa', communes: ['Ghardaïa','Berriane','Metlili'] },
  { code: '48', name: 'Relizane', communes: ['Relizane','Oued Rhiou','Mazouna'] },
  { code: '49', name: 'Timimoun', communes: ['Timimoun','Charouine'] },
  { code: '50', name: 'Bordj Badji Mokhtar', communes: ['Bordj Badji Mokhtar','Timiaouine'] },
  { code: '51', name: 'Ouled Djellal', communes: ['Ouled Djellal','Sidi Khaled'] },
  { code: '52', name: 'Béni Abbès', communes: ['Béni Abbès','Igli'] },
  { code: '53', name: 'In Salah', communes: ['In Salah','Foggaret Ezzaouia'] },
  { code: '54', name: 'In Guezzam', communes: ['In Guezzam','Tin Zaouatine'] },
  { code: '55', name: 'Touggourt', communes: ['Touggourt','Nezla'] },
  { code: '56', name: 'Djanet', communes: ['Djanet','Bordj El Haouas'] },
  { code: '57', name: 'El M\'Ghair', communes: ['El M\'Ghair','Djamaa'] },
  { code: '58', name: 'El Meniaa', communes: ['El Meniaa','Hassi Gara'] },
];

const CATEGORIES = [
  'Retail & Sales',
  'Food & Hospitality',
  'Delivery & Logistics',
  'Education & Tutoring',
  'Customer Service',
  'Administration',
  'Technology & IT',
  'Construction & Labour',
  'Healthcare & Pharmacy',
  'Media & Marketing',
  'Agriculture',
  'Security',
];

const FilterSidebar = () => {
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [jobType, setJobType] = useState({ partTime: true, fullTime: false });
  const [expLevel, setExpLevel] = useState({ zero: false, beginner: true, medium: false, expert: false });
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [commune, setCommune] = useState('');
  const [catOpen, setCatOpen] = useState(false);

  const selectedWilaya = WILAYAS.find(w => w.code === wilaya);

  const handleReset = () => {
    setSelectedCategory('');
    setJobType({ partTime: true, fullTime: false });
    setExpLevel({ zero: false, beginner: true, medium: false, expert: false });
    setSalaryFrom('');
    setSalaryTo('');
    setWilaya('');
    setCommune('');
    setCatOpen(false);
  };

  return (
    <aside className="sidebar">
      <div className="filter-header">
        <div className="filter-header-left">
          <Filter size={16} className="filter-hdr-icon" />
          <h2 className="filter-title">{t('filter')}</h2>
        </div>
        <button className="reset-btn" onClick={handleReset}>{t('resetAll')}</button>
      </div>

      {/* ── Category ── */}
      <div className="filter-section">
        <label className="section-label">{t('category')}</label>
        <div className="custom-select-wrapper">
          <button
            className={`custom-select-trigger ${catOpen ? 'open' : ''}`}
            onClick={() => setCatOpen(p => !p)}
            type="button"
          >
            <span className={selectedCategory ? 'val-set' : 'val-placeholder'}>
              {selectedCategory || 'All Categories'}
            </span>
            <ChevronDown size={16} className={`chevron ${catOpen ? 'rotated' : ''}`} />
          </button>
          {catOpen && (
            <div className="cat-dropdown">
              <div
                className={`cat-option ${selectedCategory === '' ? 'selected' : ''}`}
                onClick={() => { setSelectedCategory(''); setCatOpen(false); }}
              >
                All Categories
              </div>
              {CATEGORIES.map(cat => (
                <div
                  key={cat}
                  className={`cat-option ${selectedCategory === cat ? 'selected' : ''}`}
                  onClick={() => { setSelectedCategory(cat); setCatOpen(false); }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Job Type ── */}
      <div className="filter-section">
        <label className="section-label">{t('jobType')}</label>
        <div className="checkbox-group">
          <label className="check-item">
            <input
              type="checkbox"
              checked={jobType.partTime}
              onChange={e => setJobType(p => ({ ...p, partTime: e.target.checked }))}
            />
            <span className="check-text">{t('partTime')}</span>
          </label>
          <label className="check-item">
            <input
              type="checkbox"
              checked={jobType.fullTime}
              onChange={e => setJobType(p => ({ ...p, fullTime: e.target.checked }))}
            />
            <span className="check-text">{t('fullTime')}</span>
          </label>
        </div>
      </div>

      {/* ── Experience Level ── */}
      <div className="filter-section">
        <label className="section-label">{t('expLevel')}</label>
        <div className="checkbox-grid">
          {[
            { key: 'zero', label: t('zeroExp') },
            { key: 'beginner', label: t('beginner') },
            { key: 'medium', label: t('medium') },
            { key: 'expert', label: t('expert') },
          ].map(({ key, label }) => (
            <label key={key} className="check-item">
              <input
                type="checkbox"
                checked={expLevel[key]}
                onChange={e => setExpLevel(p => ({ ...p, [key]: e.target.checked }))}
              />
              <span className="check-text">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Salary Range ── */}
      <div className="filter-section">
        <label className="section-label">{t('salaryPerDay')}</label>
        <div className="salary-range-row">
          <div className="salary-input-wrap">
            <input
              type="number"
              min="0"
              placeholder="0"
              className="salary-input"
              value={salaryFrom}
              onChange={e => setSalaryFrom(e.target.value)}
            />
            <span className="salary-unit">Da</span>
          </div>
          <span className="salary-dash">–</span>
          <div className="salary-input-wrap">
            <input
              type="number"
              min="0"
              placeholder="10 000"
              className="salary-input"
              value={salaryTo}
              onChange={e => setSalaryTo(e.target.value)}
            />
            <span className="salary-unit">Da</span>
          </div>
        </div>
        {salaryFrom && salaryTo && Number(salaryTo) < Number(salaryFrom) && (
          <p className="salary-error">Max must be greater than min</p>
        )}
      </div>

      {/* ── Location ── */}
      <div className="filter-section">
        <label className="section-label">{t('location')}</label>

        <div className="select-wrap">
          <select
            className="native-select"
            value={wilaya}
            onChange={e => { setWilaya(e.target.value); setCommune(''); }}
          >
            <option value="">— {t('city') || 'Wilaya'} —</option>
            {WILAYAS.map(w => (
              <option key={w.code} value={w.code}>
                {w.code} – {w.name}
              </option>
            ))}
          </select>
          <ChevronDown size={15} className="select-chevron" />
        </div>

        {wilaya && (
          <div className="select-wrap" style={{ marginTop: 10 }}>
            <select
              className="native-select"
              value={commune}
              onChange={e => setCommune(e.target.value)}
            >
              <option value="">— {t('town') || 'Commune'} —</option>
              {selectedWilaya?.communes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={15} className="select-chevron" />
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="filter-footer">
        <button className="apply-btn">{t('apply')}</button>
        <button className="reset-footer-btn" onClick={handleReset}>{t('reset')}</button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 24px;
          height: fit-content;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 16px;
        }

        .filter-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-hdr-icon { color: #7C3AED; }

        .filter-title {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .reset-btn {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }

        .reset-btn:hover { color: #7C3AED; }

        .filter-section {
          margin-bottom: 24px;
        }

        .section-label {
          display: block;
          font-size: 12px;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 12px;
        }

        /* ── Custom Category Dropdown ── */
        .custom-select-wrapper {
          position: relative;
        }

        .custom-select-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          cursor: pointer;
          transition: border-color 0.2s;
          text-align: start;
          font-family: inherit;
        }

        .custom-select-trigger.open,
        .custom-select-trigger:hover {
          border-color: #8B5CF6;
        }

        .val-placeholder { color: #94A3B8; font-weight: 500; }
        .val-set { color: #1E293B; }

        .chevron {
          color: #94A3B8;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .chevron.rotated { transform: rotate(180deg); }

        .cat-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: white;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          overflow-y: auto;
          max-height: 220px;
          z-index: 999;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .cat-option {
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          cursor: pointer;
          transition: background 0.15s;
        }

        .cat-option:hover { background: #F5F3FF; color: #6D28D9; }
        .cat-option.selected { background: #EDE9FE; color: #6D28D9; font-weight: 700; }

        /* ── Checkboxes ── */
        .checkbox-group {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .check-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #6D28D9;
          flex-shrink: 0;
        }

        .check-text {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
        }

        /* ── Salary Range ── */
        .salary-range-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .salary-input-wrap {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .salary-input {
          width: 100%;
          padding: 10px 36px 10px 12px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
          -moz-appearance: textfield;
        }

        .salary-input::-webkit-outer-spin-button,
        .salary-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .salary-input:focus { border-color: #8B5CF6; }

        .salary-unit {
          position: absolute;
          inset-inline-end: 10px;
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
          opacity: 0.6;
          pointer-events: none;
          letter-spacing: 0.3px;
        }

        .salary-dash {
          font-size: 16px;
          font-weight: 700;
          color: #CBD5E1;
          flex-shrink: 0;
        }

        .salary-error {
          margin-top: 6px;
          font-size: 11px;
          color: #EF4444;
          font-weight: 600;
        }

        /* ── Location Selects ── */
        .select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .native-select {
          width: 100%;
          padding: 10px 36px 10px 14px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
          outline: none;
          cursor: pointer;
          appearance: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        [dir="rtl"] .native-select {
          padding: 10px 14px 10px 36px;
        }

        .native-select:focus { border-color: #8B5CF6; }

        .select-chevron {
          position: absolute;
          inset-inline-end: 12px;
          color: #94A3B8;
          pointer-events: none;
        }

        /* ── Footer ── */
        .filter-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #F1F5F9;
        }

        .apply-btn {
          background: #6D28D9;
          color: white;
          padding: 11px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 13px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .apply-btn:hover { background: #5B21B6; }

        .reset-footer-btn {
          background: #F5F3FF;
          color: #6D28D9;
          border: 1.5px solid #DDD6FE;
          padding: 11px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-footer-btn:hover {
          background: #EDE9FE;
        }
      `}} />
    </aside>
  );
};

export default FilterSidebar;
