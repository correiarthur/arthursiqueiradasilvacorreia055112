import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { toast } from 'sonner';

interface DadosLogin {
    usuario: string;
    senha: string;
}

const PaginaLogin = () => {
    const navegar = useNavigate();
    const [carregando, setCarregando] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<DadosLogin>();

    const lidarComLogin = async (dados: DadosLogin) => {
        setCarregando(true);
        try {
            await authService.login(dados.usuario, dados.senha);

            toast.success("Bem-vindo de volta ao AmigoFiel!");
            navegar('/');
        } catch (erro) {
            console.error("Erro na autenticação:", erro);
            toast.error("Usuário ou senha inválidos.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-gradient-to-br from-background to-secondary/10">
            <Card className="w-full max-w-md border-secondary/50 shadow-xl bg-card animate-in fade-in zoom-in duration-300">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
                        <span className="text-3xl">🐾</span>
                    </div>
                    <CardTitle className="text-2xl font-display font-bold text-primary">Amigo<span className="text-blue-300">Fiel</span></CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit(lidarComLogin)} className="pb-8">
                    <CardContent className="space-y-5 px-8">
                        <div className="space-y-2">
                            <Label className='text-xs font-bold uppercase tracking-wider text-slate-500' htmlFor="usuario">Usuário</Label>
                            <Input
                                id="usuario"
                                placeholder="usuario"
                                {...register('usuario', { required: 'O nome de usuário é obrigatório' })}
                                className={errors.usuario ? "border-destructive h-11" : "h-11 border-slate-200 focus:border-primary focus:ring-primary"}
                            />
                            {errors.usuario && (
                                <p className="text-[10px] font-bold text-destructive uppercase">{errors.usuario.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className='text-xs font-bold uppercase tracking-wider text-slate-500' htmlFor="senha">Senha</Label>
                            <Input
                                id="senha"
                                type="password"
                                placeholder="••••••••"
                                {...register('senha', { required: 'A senha é obrigatória' })}
                                className={errors.senha ? "border-destructive h-11" : "h-11 border-slate-200 focus:border-primary focus:ring-primary"}
                            />
                            {errors.senha && (
                                <p className="text-[10px] font-bold text-destructive uppercase">{errors.senha.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-6 px-8 mt-4">
                        <Button type="submit" className="w-full font-black text-sm uppercase tracking-widest bg-primary hover:bg-primary-hover h-12 shadow-lg shadow-blue-900/20" disabled={carregando}>
                            {carregando ? 'Validando Acesso...' : 'Autenticar'}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Esqueceu sua senha? Entre em contato com o administrador.
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default PaginaLogin;