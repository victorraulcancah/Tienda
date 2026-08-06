import { useState, useEffect } from "react";
import { Eye, EyeOff, ShoppingBasket, AlertCircle, CheckCircle2, Truck, Percent, PackageCheck } from "lucide-react";

const messages = [
  {
    icon: Truck,
    title: "Pedidos al día",
    text: "Controla tus entregas y proveedores desde un solo panel.",
  },
  {
    icon: Percent,
    title: "Precios siempre actualizados",
    text: "Cambia precios y promociones sin reimprimir nada.",
  },
  {
    icon: PackageCheck,
    title: "Inventario en tiempo real",
    text: "Sabe qué se agota antes de que pase en caja.",
  },
];

export default function GroceryLoginSplit() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % messages.length), 3500);
    return () => clearInterval(id);
  }, []);

  const validate = () => {
    const next = {};
    if (!email) next.email = "Ingresa tu correo.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Ese correo no parece válido.";
    if (!password) next.password = "Ingresa tu contraseña.";
    else if (password.length < 6) next.password = "Debe tener al menos 6 caracteres.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setStatus(null);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === "correo@tienda.com" && password === "abarrotes") {
        setStatus({ type: "success", message: "Bienvenido de vuelta. Redirigiendo al panel..." });
      } else {
        setStatus({ type: "error", message: "Correo o contraseña incorrectos. Intenta de nuevo." });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-zinc-950">
      {/* Columna izquierda: formulario (estilo original) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center">
              <ShoppingBasket size={16} className="text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-medium text-lg tracking-tight">Don Abarrotes</span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm shadow-2xl shadow-black/40 p-8">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">Inicia sesión</h1>
              <p className="text-sm text-zinc-400 mt-1">Accede al inventario, ventas y pedidos del día.</p>
            </div>

            {status && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3 py-2.5 mb-4 text-sm animate-in fade-in slide-in-from-top-1 duration-300 ${
                  status.type === "error"
                    ? "bg-red-950/40 text-red-300 border border-red-900/50"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/50"
                }`}
              >
                {status.type === "error" ? (
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className={`w-full rounded-md border bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-2 transition-colors ${
                    errors.email ? "border-red-800 focus:ring-red-900/40" : "border-zinc-800 focus:ring-zinc-100/20 focus:border-zinc-700"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                    Contraseña
                  </label>
                  <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full rounded-md border bg-zinc-950 px-3 py-2 pr-10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:ring-2 transition-colors ${
                      errors.password ? "border-red-800 focus:ring-red-900/40" : "border-zinc-800 focus:ring-zinc-100/20 focus:border-zinc-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-zinc-100 text-zinc-900 text-sm font-medium py-2.5 hover:bg-white transition-colors disabled:opacity-60 mt-1"
              >
                {loading ? (
                  <span className="h-4 w-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                ) : (
                  "Ingresar al panel"
                )}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-600 mt-5">
              Prueba con <span className="text-zinc-400">correo@tienda.com</span> / <span className="text-zinc-400">abarrotes</span>
            </p>
          </div>
        </div>
      </div>

      {/* Columna derecha: mensajes animados */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900">
        {/* formas flotantes de fondo */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-zinc-100/5 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 max-w-sm px-8">
          <div className="flex gap-1.5 mb-8">
            {messages.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active ? "w-8 bg-zinc-100" : "w-1.5 bg-zinc-700"
                }`}
              />
            ))}
          </div>

          {messages.map((m, i) => {
            const Icon = m.icon;
            const isActive = i === active;
            return (
              <div
                key={i}
                className={`absolute inset-x-8 transition-all duration-700 ease-out ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                <div className="h-11 w-11 rounded-xl bg-zinc-100/10 border border-zinc-800 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-zinc-100" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-50 tracking-tight mb-2">
                  {m.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{m.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
