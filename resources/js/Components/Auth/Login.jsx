import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Eye,
    EyeOff,
    ShoppingBasket,
    AlertCircle,
    CheckCircle2,
    LogOut,
    Mail,
    Lock,
    ArrowRight,
    LayoutDashboard,
    Warehouse,
    ScanBarcode,
    Truck,
    TrendingUp,
    ShieldCheck,
} from 'lucide-react';

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Accept'] = 'application/json';

const SLIDE_MS = 6000;

/* Vistas previas en miniatura: dan idea del producto sin ser capturas reales */

function ErpPreview() {
    const stats = [
        { label: 'Ventas hoy', value: 'S/ 4,820', delta: '+12%' },
        { label: 'Margen', value: '31.4%', delta: '+2.1%' },
    ];
    return (
        <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">{s.label}</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-100">{s.value}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-400">
                            <TrendingUp size={10} />
                            {s.delta}
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex h-14 items-end gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
                {[40, 65, 45, 80, 55, 95, 70].map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-sm bg-emerald-500/60"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>
        </div>
    );
}

function WmsPreview() {
    const racks = [
        { code: 'A-01', pct: 82 },
        { code: 'A-02', pct: 46 },
        { code: 'B-07', pct: 94 },
    ];
    return (
        <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
            {racks.map((r) => (
                <div key={r.code} className="flex items-center gap-3">
                    <span className="w-10 shrink-0 font-mono text-[10px] text-zinc-500">{r.code}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                        <div className="h-full rounded-full bg-sky-400/70" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-zinc-400">{r.pct}%</span>
                </div>
            ))}
            <div className="flex items-center gap-1.5 border-t border-zinc-800 pt-2 text-[10px] text-zinc-500">
                <ShieldCheck size={11} className="text-sky-400" />
                1,240 SKUs conciliados
            </div>
        </div>
    );
}

function PosPreview() {
    const items = [
        { name: 'Arroz Costeño 5kg', qty: 2, total: '29.80' },
        { name: 'Aceite Primor 1L', qty: 1, total: '9.50' },
        { name: 'Leche Gloria x6', qty: 1, total: '21.90' },
    ];
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
            <div className="space-y-1.5">
                {items.map((it) => (
                    <div key={it.name} className="flex items-center justify-between gap-3 text-[11px]">
                        <span className="truncate text-zinc-400">
                            <span className="mr-1.5 text-zinc-600">{it.qty}×</span>
                            {it.name}
                        </span>
                        <span className="shrink-0 tabular-nums text-zinc-300">{it.total}</span>
                    </div>
                ))}
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-zinc-800 pt-2.5">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Total</span>
                <span className="text-sm font-semibold tabular-nums text-amber-300">S/ 61.20</span>
            </div>
        </div>
    );
}

function TmsPreview() {
    const stops = [
        { name: 'Almacén central', time: '08:00', done: true },
        { name: 'Bodega San Juan', time: '09:40', done: true },
        { name: 'Mercado Central', time: '11:15', done: false },
    ];
    return (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
            {stops.map((s, i) => (
                <div key={s.name} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                                s.done ? 'bg-violet-400' : 'border border-zinc-600 bg-zinc-900'
                            }`}
                        />
                        {i < stops.length - 1 && <span className="w-px flex-1 bg-zinc-800" />}
                    </div>
                    <div className={`flex flex-1 items-center justify-between gap-3 ${i < stops.length - 1 ? 'pb-3' : ''}`}>
                        <span className={`text-[11px] ${s.done ? 'text-zinc-400' : 'text-zinc-500'}`}>{s.name}</span>
                        <span className="shrink-0 font-mono text-[10px] text-zinc-600">{s.time}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

const modules = [
    {
        id: 'erp',
        label: 'ERP',
        icon: LayoutDashboard,
        title: 'Todo el negocio en un tablero',
        text: 'Compras, finanzas y reportes con la misma información, sin cuadrar hojas de cálculo.',
        chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
        dot: 'bg-emerald-400',
        glow: 'bg-emerald-500/15',
        Preview: ErpPreview,
    },
    {
        id: 'wms',
        label: 'WMS',
        icon: Warehouse,
        title: 'Almacén bajo control',
        text: 'Ubicaciones, lotes y picking guiado. Sabes qué se agota antes de que pase en caja.',
        chip: 'bg-sky-500/10 text-sky-300 border-sky-500/25',
        dot: 'bg-sky-400',
        glow: 'bg-sky-500/15',
        Preview: WmsPreview,
    },
    {
        id: 'pos',
        label: 'POS',
        icon: ScanBarcode,
        title: 'Cobra en segundos',
        text: 'Punto de venta rápido, con precios y promociones siempre sincronizados.',
        chip: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
        dot: 'bg-amber-400',
        glow: 'bg-amber-500/15',
        Preview: PosPreview,
    },
    {
        id: 'tms',
        label: 'TMS',
        icon: Truck,
        title: 'Rutas y entregas al día',
        text: 'Planifica despachos, sigue a cada unidad y confirma entregas desde el mismo panel.',
        chip: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
        dot: 'bg-violet-400',
        glow: 'bg-violet-500/15',
        Preview: TmsPreview,
    },
];

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const [user, setUser] = useState(null);
    const elapsed = useRef(0);

    useEffect(() => {
        elapsed.current = 0;
        setProgress(0);
    }, [active]);

    useEffect(() => {
        if (paused) return;
        let last = performance.now();
        const id = setInterval(() => {
            const now = performance.now();
            elapsed.current += now - last;
            last = now;
            const pct = Math.min(100, (elapsed.current / SLIDE_MS) * 100);
            setProgress(pct);
            if (pct >= 100) setActive((a) => (a + 1) % modules.length);
        }, 40);
        return () => clearInterval(id);
    }, [active, paused]);

    const validate = () => {
        const next = {};
        if (!email) next.email = 'Ingresa tu correo.';
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Ese correo no parece válido.';
        if (!password) next.password = 'Ingresa tu contraseña.';
        else if (password.length < 6) next.password = 'Debe tener al menos 6 caracteres.';
        return next;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const next = validate();
        setErrors(next);
        setStatus(null);
        if (Object.keys(next).length > 0) return;

        setLoading(true);
        try {
            const { data } = await axios.post('/login', { email, password, remember });
            localStorage.setItem('token', data.token);
            setStatus({ type: 'success', message: 'Bienvenido de vuelta. Redirigiendo al panel...' });
            setTimeout(() => setUser(data.user), 600);
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message ?? 'No se pudo conectar con el servidor.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await axios.post('/logout', null, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch {
                // el token local se elimina de todas formas
            }
        }
        localStorage.removeItem('token');
        setUser(null);
        setEmail('');
        setPassword('');
    };

    const fillDemo = () => {
        setEmail('admin@tienda.com');
        setPassword('password');
        setErrors({});
    };

    const current = modules[active];

    return (
        <div className="flex min-h-dvh w-full bg-zinc-950 font-sans antialiased">
            {/* ---------- Columna izquierda: acceso ---------- */}
            <div className="relative flex w-full flex-col justify-between p-6 sm:p-10 lg:w-[46%]">
                {/* resplandor sutil detrás del formulario */}
                <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

                <header className="relative flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-400 shadow-lg shadow-black/40">
                        <ShoppingBasket size={17} className="text-zinc-950" />
                    </div>
                    <div className="leading-tight">
                        <p className="text-[15px] font-semibold tracking-tight text-zinc-100">Don Abarrotes</p>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Suite operativa</p>
                    </div>
                </header>

                <main className="relative mx-auto w-full max-w-sm py-10">
                    <div className="mb-7">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Inicia sesión</h1>
                        <p className="mt-1.5 text-sm text-zinc-400">
                            Un solo acceso para ERP, almacén, caja y despacho.
                        </p>
                    </div>

                    {status && (
                        <div
                            className={`mb-5 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm duration-300 animate-in fade-in slide-in-from-top-1 ${
                                status.type === 'error'
                                    ? 'border-red-900/50 bg-red-950/40 text-red-300'
                                    : 'border-emerald-900/50 bg-emerald-950/40 text-emerald-300'
                            }`}
                        >
                            {status.type === 'error' ? (
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            ) : (
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            )}
                            <span>{status.message}</span>
                        </div>
                    )}

                    {user ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-400">
                                    <span className="text-sm font-semibold text-zinc-950">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-zinc-50">{user.name}</p>
                                    <p className="truncate text-xs text-zinc-400">{user.email}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
                            >
                                <LogOut size={16} />
                                Cerrar sesión
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-[13px] font-medium text-zinc-300">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={15}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nombre@empresa.com"
                                        className={`w-full rounded-lg border bg-zinc-900/60 py-2.5 pl-9 pr-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:ring-2 ${
                                            errors.email
                                                ? 'border-red-800 focus:ring-red-900/40'
                                                : 'border-zinc-800 focus:border-zinc-700 focus:ring-zinc-100/10'
                                        }`}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-[13px] font-medium text-zinc-300">
                                        Contraseña
                                    </label>
                                    <a href="#" className="text-xs text-zinc-500 transition-colors hover:text-zinc-300">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock
                                        size={15}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                    />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full rounded-lg border bg-zinc-900/60 py-2.5 pl-9 pr-10 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:ring-2 ${
                                            errors.password
                                                ? 'border-red-800 focus:ring-red-900/40'
                                                : 'border-zinc-800 focus:border-zinc-700 focus:ring-zinc-100/10'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                            </div>

                            <label className="flex cursor-pointer select-none items-center gap-2 pt-0.5 text-xs text-zinc-400">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-900 accent-zinc-100"
                                />
                                Mantener sesión iniciada en este equipo
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-black/30 transition hover:bg-white disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-zinc-900" />
                                ) : (
                                    <>
                                        Ingresar al panel
                                        <ArrowRight
                                            size={15}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={fillDemo}
                                className="w-full rounded-lg border border-dashed border-zinc-800 py-2 text-xs text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
                            >
                                Usar credenciales de prueba —{' '}
                                <span className="text-zinc-400">admin@tienda.com</span> / password
                            </button>
                        </form>
                    )}

                    {/* módulos en móvil, donde la columna derecha no se muestra */}
                    <div className="mt-8 flex flex-wrap gap-1.5 lg:hidden">
                        {modules.map((m) => (
                            <span
                                key={m.id}
                                className={`rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${m.chip}`}
                            >
                                {m.label}
                            </span>
                        ))}
                    </div>
                </main>

                <footer className="relative flex items-center justify-between text-[11px] text-zinc-600">
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Servidor operativo
                    </span>
                    <span>v1.0 · Conexión cifrada</span>
                </footer>
            </div>

            {/* ---------- Columna derecha: presentación de módulos ---------- */}
            <div
                className="relative hidden overflow-hidden border-l border-zinc-900 bg-zinc-950 lg:flex lg:w-[54%] lg:items-center lg:justify-center"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* rejilla técnica de fondo */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgb(39 39 42) 1px, transparent 1px), linear-gradient(to bottom, rgb(39 39 42) 1px, transparent 1px)',
                        backgroundSize: '56px 56px',
                        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 45%, black 30%, transparent 75%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 80% 60% at 50% 45%, black 30%, transparent 75%)',
                    }}
                />
                {/* resplandor que cambia con el módulo activo */}
                <div
                    className={`pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl transition-colors duration-1000 ${current.glow}`}
                />
                <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-zinc-100/[0.03] blur-3xl" />

                <div className="relative z-10 w-full max-w-md px-10">
                    {/* selector de módulos */}
                    <div className="mb-9 flex gap-2">
                        {modules.map((m, i) => {
                            const Icon = m.icon;
                            const isActive = i === active;
                            return (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setActive(i)}
                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-semibold tracking-wide transition-all duration-300 ${
                                        isActive
                                            ? m.chip
                                            : 'border-zinc-800/80 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                                    }`}
                                >
                                    <Icon size={13} />
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* contenido del módulo activo */}
                    <div className="relative min-h-[22rem]">
                        {modules.map((m, i) => {
                            const Preview = m.Preview;
                            const isActive = i === active;
                            return (
                                <div
                                    key={m.id}
                                    className={`absolute inset-x-0 top-0 transition-all duration-700 ease-out ${
                                        isActive
                                            ? 'translate-y-0 opacity-100'
                                            : 'pointer-events-none translate-y-4 opacity-0'
                                    }`}
                                    aria-hidden={!isActive}
                                >
                                    <h2 className="text-pretty text-[27px] font-semibold leading-[1.15] tracking-tight text-zinc-50">
                                        {m.title}
                                    </h2>
                                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">{m.text}</p>
                                    <div className="mt-7">
                                        <Preview />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* barras de progreso del carrusel */}
                    <div className="mt-9 flex gap-2">
                        {modules.map((m, i) => (
                            <div key={m.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                    className={`h-full rounded-full ${m.dot}`}
                                    style={{
                                        width: i === active ? `${progress}%` : i < active ? '100%' : '0%',
                                        opacity: i === active ? 1 : 0.35,
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <p className="mt-5 text-[11px] leading-relaxed text-zinc-600">
                        Cuatro módulos, una sola base de datos. Lo que registra caja lo ve almacén, y lo que despacha
                        transporte lo ve contabilidad.
                    </p>
                </div>
            </div>
        </div>
    );
}
