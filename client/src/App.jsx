import React,{useEffect,useState}from'react';import{Routes,Route,Navigate,Link,useNavigate,useLocation}from'react-router-dom';import{Activity,HeartPulse,Users,CalendarDays,FileText,ShieldCheck,LogOut,LayoutDashboard,Search,Plus,Clock,AlertTriangle,Stethoscope,Menu,X,MessageSquare,RefreshCw,UserRound,ChevronRight,CheckCircle2,BrainCircuit}from'lucide-react';import api from'./api';
const moneyDate=d=>d?new Date(d).toLocaleDateString(): '—';function AuthProvider({children}){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('mn_user'))}catch{return null}});const login=async(email,password)=>{const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('mn_token',data.token);localStorage.setItem('mn_user',JSON.stringify(data.user));setUser(data.user);};const logout=()=>{localStorage.removeItem('mn_token');localStorage.removeItem('mn_user');setUser(null)};return <AuthContext.Provider value={{user,setUser,login,logout}}>{children}</AuthContext.Provider>}import{createContext,useContext}from'react';const AuthContext=createContext(null);const useAuth=()=>useContext(AuthContext);
function Guard({children}){const{user}=useAuth();return user?children:<Navigate to="/login" replace/>}
function Login(){const{login}=useAuth(),nav=useNavigate();const[email,setEmail]=useState('doctor@medinexus.demo'),[password,setPassword]=useState('Doctor123!'),[error,setError]=useState(''),[busy,setBusy]=useState(false);async function submit(e){e.preventDefault();setBusy(true);setError('');try{await login(email,password);nav('/app')}catch(e){setError(e.response?.data?.message||'Unable to sign in. Check the API and database.')}finally{setBusy(false)}}return <div className="auth-page"><div className="auth-art"><div className="brand"><span className="brand-icon"><HeartPulse/></span> MediNexus <b>AI</b></div><div className="art-copy"><span className="eyebrow">CONNECTED CARE. SMARTER DECISIONS.</span><h1>Healthcare,<br/><em>reimagined.</em></h1><p>One connected workspace for patient care, clinical records and intelligent health insights.</p><div className="art-pills"><span><ShieldCheck size={16}/> Secure access</span><span><BrainCircuit size={16}/> AI-assisted</span></div></div><div className="art-foot">A unified healthcare management ecosystem</div></div><div className="auth-form-wrap"><form className="auth-form" onSubmit={submit}><div className="mobile-brand brand"><span className="brand-icon"><HeartPulse/></span> MediNexus <b>AI</b></div><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p className="muted">Access your healthcare dashboard securely.</p><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error&&<div className="error">{error}</div>}<button className="primary full" disabled={busy}>{busy?'Signing in…':'Sign in'} <ChevronRight size={17}/></button><div className="demo-box"><b>Demo access</b><span>Provider: doctor@medinexus.demo / Doctor123!</span><span>Patient: patient@medinexus.demo / Patient123!</span><small>Run the server seed command first.</small></div></form></div></div>}
const nav=[['Overview',LayoutDashboard,'/app'],['Patients',Users,'/app/patients'],['Medical records',FileText,'/app/records'],['Appointments',CalendarDays,'/app/appointments'],['Health alerts',AlertTriangle,'/app/alerts'],['Refill requests',RefreshCw,'/app/refills'],['Messages',MessageSquare,'/app/messages']];function Shell({children}){const{user,logout}=useAuth(),loc=useLocation(),[mobile,setMobile]=useState(false);return <div className="layout"><aside className={`sidebar ${mobile?'open':''}`}><div className="brand"><span className="brand-icon"><HeartPulse/></span><span>MediNexus <b>AI</b><small>CARE ECOSYSTEM</small></span><button className="mobile-close" onClick={()=>setMobile(false)}><X/></button></div><div className="side-label">WORKSPACE</div><nav>{(user?.role==='patient'?[nav[0],nav[2],nav[3],nav[4],nav[6]]:nav).map(([label,Icon,path])=><Link onClick={()=>setMobile(false)} className={loc.pathname===path?'active':''} to={path} key={path}><Icon size={18}/>{label}</Link>)}</nav><div className="sidebar-bottom"><div className="secure"><ShieldCheck size={17}/><span><b>Protected workspace</b><small>Session authenticated</small></span></div><div className="user-mini"><div className="avatar">{user?.name?.[0]}</div><span><b>{user?.name}</b><small>{user?.role}</small></span><button title="Sign out" onClick={logout}><LogOut size={17}/></button></div></div></aside><main className="main"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="crumb">Workspace <ChevronRight size={14}/> <b>{nav.find(n=>n[2]===loc.pathname)?.[0]||'Overview'}</b></div><div className="top-right"><span className="live-dot"/> System operational <div className="avatar small-avatar">{user?.name?.[0]}</div></div></header><div className="content">{children}</div></main></div>}
function PageTitle({eyebrow,title,desc,action}){return <div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>{action}</div>}function Stat({label,value,sub,Icon,tone}){return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><span>{label}</span><strong>{value??'—'}</strong><small>{sub}</small></div>}
function Dashboard(){const{user}=useAuth(),[stats,setStats]=useState(null),[appointments,setAppointments]=useState([]),[alerts,setAlerts]=useState([]),[err,setErr]=useState('');useEffect(()=>{Promise.all([api.get('/dashboard/stats'),api.get('/appointments'),api.get('/alerts')]).then(([s,a,h])=>{setStats(s.data);setAppointments(a.data.slice(0,5));setAlerts(h.data.slice(0,3))}).catch(e=>setErr(e.response?.data?.message||'Could not load dashboard'));},[]);return <><PageTitle eyebrow="CLINICAL OVERVIEW" title={`Good day, ${user?.name?.split(' ')[0]||'there'}`} desc="Here’s what’s happening across your care workspace today."/><div className="welcome-banner"><div><span className="eyebrow">MEDINEXUS INTELLIGENCE</span><h2>Better visibility. More connected care.</h2><p>Manage patient journeys, clinical information and care coordination in one place.</p></div><div className="banner-mark"><Activity size={54}/></div></div>{err&&<div className="error">{err}</div>}<div className="stats-grid"><Stat label="Total patients" value={stats?.patients??'—'} sub="Registered profiles" Icon={Users} tone="blue"/><Stat label="Medical records" value={stats?.records??'—'} sub="Across patient histories" Icon={FileText} tone="violet"/><Stat label="Appointments" value={stats?.appointments??'—'} sub={`${stats?.pending??0} awaiting review`} Icon={CalendarDays} tone="green"/><Stat label="Active alerts" value={stats?.alerts??'—'} sub="Require attention" Icon={AlertTriangle} tone="orange"/></div><div className="two-col"><section className="panel"><div className="panel-head"><div><h3>Upcoming appointments</h3><p>Latest scheduled patient visits</p></div><Link to="/app/appointments" className="text-link">View all <ChevronRight size={15}/></Link></div>{appointments.length?appointments.map(a=><div className="list-row" key={a._id}><div className="row-icon"><CalendarDays size={18}/></div><div className="row-main"><b>{a.patient?.fullName||'Patient appointment'}</b><small>{a.type} · {moneyDate(a.date)} {a.time||''}</small></div><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></div>):<Empty text="No appointments to display yet."/>}</section><section className="panel"><div className="panel-head"><div><h3>Health alerts</h3><p>Patient care notifications</p></div><Link to="/app/alerts" className="text-link">View all <ChevronRight size={15}/></Link></div>{alerts.length?alerts.map(a=><div className="alert-row" key={a._id}><AlertTriangle size={18}/><div><b>{a.title}</b><small>{a.patient?.fullName||'Patient'} · {a.description}</small></div></div>):<Empty text="No active alerts."/>}</section></div><div className="notice"><ShieldCheck size={19}/><span><b>Privacy matters.</b> Access patient information only for authorized care purposes. This educational build uses role-based API access and should receive a full security review before real clinical deployment.</span></div></>}
function Empty({text}){return <div className="empty">{text}</div>}function Patients(){const[items,setItems]=useState([]),[q,setQ]=useState(''),[show,setShow]=useState(false),[form,setForm]=useState({fullName:'',email:'',phone:'',bloodGroup:'',gender:'',dateOfBirth:''}),[msg,setMsg]=useState('');async function load(){const{data}=await api.get('/patients',{params:{q}});setItems(data)}useEffect(()=>{load().catch(e=>setMsg(e.response?.data?.message||'Unable to load patients'))},[q]);async function add(e){e.preventDefault();try{await api.post('/patients',form);setShow(false);setForm({fullName:'',email:'',phone:'',bloodGroup:'',gender:'',dateOfBirth:''});load();}catch(e){setMsg(e.response?.data?.message||'Could not save patient')}}return <><PageTitle eyebrow="PATIENT DIRECTORY" title="Patients" desc="Register, search and manage patient profiles." action={<button className="primary" onClick={()=>setShow(!show)}><Plus size={17}/> Add patient</button>}/>{show&&<form className="panel form-grid" onSubmit={add}><h3 className="span-2">New patient profile</h3><label>Full name<input required value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Date of birth<input type="date" value={form.dateOfBirth} onChange={e=>setForm({...form,dateOfBirth:e.target.value})}/></label><label>Blood group<select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})}><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(x=><option>{x}</option>)}</select></label><label>Gender<select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></label><div className="span-2 form-actions"><button className="primary">Save patient</button><button type="button" className="secondary" onClick={()=>setShow(false)}>Cancel</button></div></form>}{msg&&<div className="error">{msg}</div>}<section className="panel"><div className="table-toolbar"><div><h3>All patients <span className="count">{items.length}</span></h3><p>Patient records in your workspace</p></div><div className="search"><Search size={17}/><input placeholder="Search name or email" value={q} onChange={e=>setQ(e.target.value)}/></div></div><div className="table-wrap"><table><thead><tr><th>PATIENT</th><th>CONTACT</th><th>BLOOD GROUP</th><th>CONDITIONS</th><th>REGISTERED</th></tr></thead><tbody>{items.map(p=><tr key={p._id}><td><b>{p.fullName}</b><small className="cell-sub">{p.gender||'—'}</small></td><td>{p.email||p.phone||'—'}</td><td><span className="blood">{p.bloodGroup||'—'}</span></td><td>{p.conditions?.join(', ')||'—'}</td><td>{moneyDate(p.createdAt)}</td></tr>)}</tbody></table>{!items.length&&<Empty text="No patient profiles found. Add a patient to get started."/>}</div></section></>}
function Records(){const[items,setItems]=useState([]),[patients,setPatients]=useState([]),[show,setShow]=useState(false),[form,setForm]=useState({patient:'',type:'Consultation',title:'',diagnosis:'',description:'',treatment:''}),[summary,setSummary]=useState(null),[msg,setMsg]=useState('');async function load(){const[a,b]=await Promise.all([api.get('/records'),api.get('/patients')]);setItems(a.data);setPatients(b.data)}useEffect(()=>{load().catch(e=>setMsg(e.response?.data?.message||'Unable to load records'))},[]);async function add(e){e.preventDefault();try{await api.post('/records',form);setShow(false);setForm({patient:'',type:'Consultation',title:'',diagnosis:'',description:'',treatment:''});load()}catch(e){setMsg(e.response?.data?.message||'Unable to save record')}}async function summarize(id){try{const{data}=await api.post(`/records/${id}/summary`);setSummary(data)}catch(e){setMsg(e.response?.data?.message||'Summary unavailable')}}return <><PageTitle eyebrow="CLINICAL DOCUMENTATION" title="Medical records" desc="Review clinical history and add patient records." action={<button className="primary" onClick={()=>setShow(!show)}><Plus size={17}/> Add record</button>}/>{show&&<form className="panel form-grid" onSubmit={add}><h3 className="span-2">Create medical record</h3><label>Patient<select required value={form.patient} onChange={e=>setForm({...form,patient:e.target.value})}><option value="">Choose patient</option>{patients.map(p=><option value={p._id}>{p.fullName}</option>)}</select></label><label>Record type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{['Consultation','Lab Result','Prescription','Imaging','Vaccination','Vitals','Diagnosis'].map(x=><option>{x}</option>)}</select></label><label className="span-2">Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Diagnosis<input value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})}/></label><label>Treatment<input value={form.treatment} onChange={e=>setForm({...form,treatment:e.target.value})}/></label><label className="span-2">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="span-2 form-actions"><button className="primary">Save record</button><button type="button" className="secondary" onClick={()=>setShow(false)}>Cancel</button></div></form>}{msg&&<div className="error">{msg}</div>}{summary&&<div className="panel summary"><div className="panel-head"><h3><BrainCircuit size={18}/> AI-assisted record summary</h3><button className="icon-btn" onClick={()=>setSummary(null)}><X/></button></div><p>{summary.summary}</p><small>{summary.disclaimer}</small></div>}<section className="panel"><div className="panel-head"><div><h3>Recent records</h3><p>Clinical notes and patient documentation</p></div></div>{items.map(r=><div className="record-row" key={r._id}><div className="row-icon"><FileText/></div><div className="row-main"><b>{r.title}</b><small>{r.patient?.fullName||'Patient'} · {r.type} · {moneyDate(r.createdAt)}</small><p>{r.diagnosis||r.description||'No additional details'}</p></div><button className="secondary small-btn" onClick={()=>summarize(r._id)}><BrainCircuit size={15}/> Summarize</button></div>)}{!items.length&&<Empty text="No medical records found."/>}</section></>}
function Appointments() {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [role, setRole] = useState('');
  const [patientName, setPatientName] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    type: 'General consultation',
    date: '',
    time: '',
    notes: ''
  });

  async function load() {
    try {
      const { data } = await api.get('/appointments');
      setItems(data);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not load appointments');
    }
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { data: account } = await api.get('/auth/me');
        if (!active) return;

        const userRole = account.user?.role || account.role;
        setRole(userRole);

        if (userRole === 'patient') {
          const { data } = await api.get('/patients/mine');
          if (!active) return;

          setMyProfile(data);
          setPatientName(data.fullName || '');
        } else {
          const { data } = await api.get('/patients');
          if (!active) return;

          setPatients(data);
        }
      } catch (err) {
        if (active) {
          setMsg(
            err.response?.data?.message ||
            'Could not load patient information'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();
    load();

    return () => {
      active = false;
    };
  }, []);

  async function add(e) {
    e.preventDefault();
    setMsg('');

    let patientId = '';

    if (role === 'patient') {
      patientId = myProfile?._id;
    } else {
      const match = patients.find(
        p => p.fullName?.trim().toLowerCase() ===
          patientName.trim().toLowerCase()
      );

      patientId = match?._id;
    }

    if (!patientId) {
      setMsg(
        'Patient not found. Enter the full name of an existing patient.'
      );
      return;
    }

    try {
      await api.post('/appointments', {
        patient: patientId,
        ...form
      });

      setMsg('Appointment created successfully!');
      setShow(false);
      setForm({
        type: 'General consultation',
        date: '',
        time: '',
        notes: ''
      });

      await load();
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
        'Could not book appointment'
      );
    }
  }

  async function status(id, s) {
    try {
      await api.patch(`/appointments/${id}/status`, {
        status: s
      });
      await load();
    } catch (err) {
      setMsg(
        err.response?.data?.message ||
        'Could not update appointment'
      );
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="CARE COORDINATION"
        title="Appointments"
        desc="Coordinate patient visits and appointment status."
        action={
          <button
            className="primary"
            onClick={() => {
              setMsg('');
              setShow(!show);
            }}
          >
            <Plus size={17} />
            New appointment
          </button>
        }
      />

      {show && (
        <form className="panel form-grid" onSubmit={add}>
          <h3 className="span-2">Book appointment</h3>

          <label>
            Patient Name
            <input
              type="text"
              required
              placeholder="Enter patient name"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
            />
          </label>

         <label>
  Appointment type
  <input
    type="text"
    required
    placeholder="Enter appointment type"
    value={form.type}
    onChange={(e) => {
      setForm(prev => ({
        ...prev,
        type: e.target.value
      }));
    }}
  />
</label>

          <label>
            Date
            <input
              required
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={form.date}
              onChange={e =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={form.time}
              onChange={e =>
                setForm({ ...form, time: e.target.value })
              }
            />
          </label>

          <label className="span-2">
            Notes
            <textarea
              value={form.notes}
              onChange={e =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </label>

          <div className="span-2 form-actions">
            <button
              className="primary"
              disabled={loading}
            >
              Create appointment
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => setShow(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {msg && <div className="error">{msg}</div>}

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Appointment schedule</h3>
            <p>{items.length} appointment entries</p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PATIENT</th>
                <th>APPOINTMENT</th>
                <th>DATE & TIME</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {items.map(a => (
                <tr key={a._id}>
                  <td>
                    <b>{a.patient?.fullName || 'Patient'}</b>
                  </td>

                  <td>{a.type}</td>

                  <td>
                    {moneyDate(a.date)} · {a.time || '—'}
                  </td>

                  <td>
                    <span
                      className={`status ${a.status.toLowerCase()}`}
                    >
                      {a.status}
                    </span>
                  </td>

                  <td>
                    {role !== 'patient' && (
                      a.status === 'Pending' ? (
                        <div className="inline-actions">
                          <button
                            className="approve"
                            onClick={() =>
                              status(a._id, 'Confirmed')
                            }
                          >
                            Confirm
                          </button>

                          <button
                            className="reject"
                            onClick={() =>
                              status(a._id, 'Cancelled')
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      ) : a.status === 'Confirmed' ? (
                        <button
                          className="secondary tiny"
                          onClick={() =>
                            status(a._id, 'Completed')
                          }
                        >
                          Complete
                        </button>
                      ) : '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!items.length && (
            <Empty text="No appointments scheduled." />
          )}
        </div>
      </section>
    </>
  );
}

function Alerts(){const[items,setItems]=useState([]);useEffect(()=>{api.get('/alerts').then(x=>setItems(x.data)).catch(()=>{})},[]);return <><PageTitle eyebrow="PATIENT SAFETY" title="Health alerts" desc="Review care reminders and health notifications."/><section className="panel">{items.map(a=><div className="alert-row large" key={a._id}><div className={`severity ${a.severity}`}><AlertTriangle/></div><div><b>{a.title}</b><small>{a.patient?.fullName||'Patient'} · {a.severity} priority</small><p>{a.description}</p>{a.recommendation&&<small>{a.recommendation}</small>}</div></div>)}{!items.length&&<Empty text="There are no active health alerts."/>}</section></>}
function Refills(){const[items,setItems]=useState([]);async function load(){const{data}=await api.get('/refills');setItems(data)}useEffect(()=>{load()},[]);async function change(id,status){await api.patch(`/refills/${id}/status`,{status});load()}return <><PageTitle eyebrow="MEDICATION SUPPORT" title="Refill requests" desc="Review patient medication refill requests."/><section className="panel">{items.map(x=><div className="list-row" key={x._id}><div className="row-icon"><RefreshCw/></div><div className="row-main"><b>{x.medicationName} · {x.patient?.fullName}</b><small>{x.dosage||'Dosage not specified'} · {x.urgency} priority</small></div><span className="status pending">{x.status}</span>{x.status==='Pending'&&<div className="inline-actions"><button className="approve" onClick={()=>change(x._id,'Approved')}>Approve</button><button className="reject" onClick={()=>change(x._id,'Denied')}>Deny</button></div>}</div>)}{!items.length&&<Empty text="No refill requests."/>}</section></>}
function Messages() {
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState('');
  const [items, setItems] = useState([]);
  const [content, setContent] = useState('');
  const [isPatient, setIsPatient] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPatients() {
      try {
        // First try loading the logged-in patient's profile
        const { data } = await api.get('/patients/mine');

        if (!active) return;

        setIsPatient(true);
        setPatients([data]);
        setPatient(data._id);
      } catch (err) {
        if (!active) return;

        // Doctor/admin accounts can load the full patient list
        if (err.response?.status !== 403 &&
            err.response?.status !== 404) {
          setError('Unable to load patient information.');
          return;
        }

        try {
          const { data } = await api.get('/patients');

          if (!active) return;

          setIsPatient(false);
          setPatients(data);
          setPatient(data[0]?._id || '');
        } catch {
          if (active) setError('Unable to load patients.');
        }
      }
    }

    loadPatients();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!patient) return;

    let active = true;

    api.get(`/patients/${patient}/messages`)
      .then(({ data }) => {
        if (active) {
          setItems(data);
          setError('');
        }
      })
      .catch(() => {
        if (active) setError('Unable to load messages.');
      });

    return () => {
      active = false;
    };
  }, [patient]);

  async function send(e) {
    e.preventDefault();

    if (!patient || !content.trim()) return;

    try {
      setError('');

      await api.post(`/patients/${patient}/messages`, {
        content: content.trim(),
        subject: 'Care team message'
      });

      setContent('');

      const { data } = await api.get(
        `/patients/${patient}/messages`
      );

      setItems(data);
    } catch {
      setError('Unable to send message.');
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="CARE TEAM COMMUNICATION"
        title="Messages"
        desc="Send and review patient communication."
      />

      <section className="panel">
        {error && <div className="error">{error}</div>}

        {!isPatient && (
          <label>
            Patient
            <select
              value={patient}
              onChange={e => setPatient(e.target.value)}
            >
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="chat-list">
          {items.map(m => (
            <div
              key={m._id}
              className={`chat-bubble ${
                m.senderRole === 'patient' ? 'incoming' : ''
              }`}
            >
              <small>
                {m.sender?.name || m.senderRole}
                {' · '}
                {moneyDate(m.createdAt)}
              </small>
              <p>{m.content}</p>
            </div>
          ))}

          {!items.length && (
            <Empty text="No messages in this conversation." />
          )}
        </div>

        <form className="chat-compose" onSubmit={send}>
          <input
            required
            placeholder="Write a message…"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button
            className="primary"
            disabled={!patient}
          >
            Send
          </button>
        </form>
      </section>
    </>
  );
}

function PatientHome(){const[profile,setProfile]=useState(null),[overview,setOverview]=useState(null),[err,setErr]=useState(''),[appt,setAppt]=useState({type:'General consultation',date:'',time:'',notes:''}),[refill,setRefill]=useState({medicationName:'',dosage:'',urgency:'normal'});useEffect(()=>{api.get('/patients/mine').then(async x=>{setProfile(x.data);const o=await api.get(`/patients/${x.data._id}/overview`);setOverview(o.data)}).catch(e=>setErr(e.response?.data?.message||'Could not load your profile'))},[]);async function book(e){e.preventDefault();await api.post('/appointments',appt);alert('Appointment request submitted');const o=await api.get(`/patients/${profile._id}/overview`);setOverview(o.data)}async function requestRefill(e){e.preventDefault();await api.post(`/patients/${profile._id}/refills`,refill);alert('Refill request submitted');setRefill({medicationName:'',dosage:'',urgency:'normal'})}return <><PageTitle eyebrow="YOUR HEALTH SPACE" title={`Hello, ${profile?.fullName?.split(' ')[0]||'there'}`} desc="Your health information, appointments and care updates in one place."/>{err&&<div className="error">{err}</div>}<div className="stats-grid"><Stat label="Medical records" value={overview?.records?.length??'—'} sub="Your health history" Icon={FileText} tone="blue"/><Stat label="Appointments" value={overview?.appointments?.length??'—'} sub="Your care schedule" Icon={CalendarDays} tone="green"/><Stat label="Active alerts" value={overview?.alerts?.length??'—'} sub="Care reminders" Icon={AlertTriangle} tone="orange"/><Stat label="Blood group" value={profile?.bloodGroup||'—'} sub="Profile information" Icon={HeartPulse} tone="violet"/></div><div className="two-col"><section className="panel"><div className="panel-head"><div><h3>My medical history</h3><p>Recent clinical records</p></div></div>{overview?.records?.map(r=><div className="record-row"><div className="row-icon"><FileText/></div><div className="row-main"><b>{r.title}</b><small>{r.type} · {moneyDate(r.createdAt)}</small><p>{r.diagnosis||r.description}</p></div></div>)}{!overview?.records?.length&&<Empty text="No records available."/>}</section><section className="panel"><div className="panel-head"><div><h3>Health alerts</h3><p>Reminders from your care team</p></div></div>{overview?.alerts?.map(a=><div className="alert-row"><AlertTriangle/><div><b>{a.title}</b><small>{a.description}</small></div></div>)}{!overview?.alerts?.length&&<Empty text="No active alerts."/>}</section></div><div className="two-col"><form className="panel form-grid" onSubmit={book}><h3 className="span-2">Request an appointment</h3><label>Visit type<input value={appt.type} onChange={e=>setAppt({...appt,type:e.target.value})}/></label><label>Preferred date<input required type="date" min={new Date().toISOString().slice(0,10)} value={appt.date} onChange={e=>setAppt({...appt,date:e.target.value})}/></label><label>Preferred time<input type="time" value={appt.time} onChange={e=>setAppt({...appt,time:e.target.value})}/></label><label>Notes<input value={appt.notes} onChange={e=>setAppt({...appt,notes:e.target.value})}/></label><button className="primary span-2">Request appointment</button></form><form className="panel form-grid" onSubmit={requestRefill}><h3 className="span-2">Medication refill</h3><label>Medication<input required value={refill.medicationName} onChange={e=>setRefill({...refill,medicationName:e.target.value})}/></label><label>Dosage<input value={refill.dosage} onChange={e=>setRefill({...refill,dosage:e.target.value})}/></label><label>Urgency<select value={refill.urgency} onChange={e=>setRefill({...refill,urgency:e.target.value})}><option value="normal">Normal</option><option value="urgent">Urgent</option></select></label><button className="primary span-2">Submit refill request</button></form></div><section className="panel"><h3>My appointments</h3>{overview?.appointments?.map(a=><div className="list-row"><div className="row-icon"><CalendarDays/></div><div className="row-main"><b>{a.type}</b><small>{moneyDate(a.date)} · {a.time||'Time pending'}</small></div><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></div>)}</section></>}
function AppRoutes(){const{user}=useAuth();return <Routes><Route path="/login" element={user?<Navigate to="/app"/>:<Login/>}/><Route path="/" element={<Navigate to={user?'/app':'/login'} replace/>}/><Route path="/app/*" element={<Guard><Shell><Routes><Route index element={user?.role==='patient'?<PatientHome/>:<Dashboard/>}/><Route path="patients" element={user?.role==='patient'?<Navigate to="/app"/>:<Patients/>}/><Route path="records" element={<Records/>}/><Route path="appointments" element={<Appointments/>}/><Route path="alerts" element={<Alerts/>}/><Route path="refills" element={<Refills/>}/><Route path="messages" element={<Messages/>}/><Route path="*" element={<Navigate to="/app"/>}/></Routes></Shell></Guard>}/><Route path="*" element={<Navigate to="/"/>}/></Routes>}export default function App(){return <AuthProvider><AppRoutes/></AuthProvider>}
