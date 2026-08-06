import { useState } from 'react';
import axios from 'axios';

import { Button } from '#/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Accept'] = 'application/json';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await axios.post('/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data.user);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
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
    }

    if (user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <h1 className="text-2xl font-semibold">Bienvenido, {user.name}</h1>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Button className="mt-6 w-full" variant="outline" onClick={handleLogout}>
                            Cerrar sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
                    <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu@correo.com"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="mt-2 w-full" disabled={loading}>
                            {loading ? 'Ingresando…' : 'Ingresar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}