import React from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Dashboard } from './components/Dashboard';
import { TimeTable } from './components/TimeTable';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { CustomerControl } from './components/CustomerControl';
import { Releases } from './components/Releases';
import { MessageModal } from './components/MessageModal';
import { BookingForm } from './components/BookingForm';
import { CancelForm } from './components/CancelForm';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabaseSecret = 'your-supabase-secret';

const supabase = createClient(supabaseUrl, supabaseKey, supabaseSecret);

function App() {
    const [session, setSession] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('dashboard');
    const [bookings, setBookings] = React.useState([]);
    const [showMessage, setShowMessage] = React.useState({ 
        show: false, 
        title: '', 
        message: '', 
        type: 'success' 
    });

    React.useEffect(() => {
        // Verifica a sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) loadBookings();
        });

        // Escuta mudanças na autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) loadBookings();
        });

        return () => subscription.unsubscribe();
    }, []);

    async function loadBookings() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    courts (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Erro ao carregar reservas:', error);
            showMessageModal('Erro', 'Erro ao carregar reservas', 'error');
        }
    }

    function handleMenuSelect(view) {
        if (view === 'exit') {
            handleLogout();
        } else {
            setCurrentView(view);
        }
    }

    function handleSettingsClick() {
        setCurrentView('settings');
    }

    function handleLogin() {
        setCurrentView('dashboard');
    }

    async function handleLogout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            setCurrentView('login');
            showMessageModal('Sucesso', 'Logout realizado com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            showMessageModal('Erro', 'Erro ao realizar logout', 'error');
        }
    }

    async function handleBookingComplete(bookingData) {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert([{
                    ...bookingData,
                    user_id: session.user.id
                }])
                .select();

            if (error) throw error;
            
            await loadBookings();
            showMessageModal('Sucesso', 'Reserva realizada com sucesso!');
        } catch (error) {
            console.error('Erro ao realizar reserva:', error);
            showMessageModal('Erro', 'Erro ao realizar reserva', 'error');
        }
    }

    function showMessageModal(title, message, type = 'success') {
        setShowMessage({
            show: true,
            title,
            message,
            type
        });
    }

    if (!session) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div data-name="app" className="min-h-screen bg-gray-100">
            <Header onSettingsClick={handleSettingsClick} />
            <Menu onMenuSelect={handleMenuSelect} currentView={currentView} />
            
            <div className="container mx-auto px-4 py-8">
                {currentView === 'dashboard' && (
                    <Dashboard bookings={bookings} />
                )}
                
                {currentView === 'schedule' && (
                    <TimeTable 
                        bookings={bookings} 
                        onBookingComplete={handleBookingComplete} 
                    />
                )}
                
                {currentView === 'book' && (
                    <BookingForm 
                        bookings={bookings} 
                        onBookingComplete={handleBookingComplete}
                    />
                )}
                
                {currentView === 'cancel' && (
                    <CancelForm 
                        bookings={bookings}
                        onCancelComplete={async (cancelledBookingId) => {
                            try {
                                const { error } = await supabase
                                    .from('bookings')
                                    .delete([cancelledBookingId]);

                                if (error) throw error;
                                
                                await loadBookings();
                                showMessageModal('Sucesso', 'Reserva cancelada com sucesso!');
                            } catch (error) {
                                console.error('Erro ao cancelar reserva:', error);
                                showMessageModal('Erro', 'Erro ao cancelar reserva', 'error');
                            }
                        }}
                    />
                )}

                {currentView === 'customers' && (
                    <CustomerControl />
                )}

                {currentView === 'settings' && (
                    <Settings 
                        onSuccess={(title, message) => showMessageModal(title, message)}
                        onError={(title, message) => showMessageModal(title, message, 'error')}
                    />
                )}

                {currentView === 'reports' && (
                    <Reports />
                )}

                {currentView === 'releases' && (
                    <Releases />
                )}
            </div>

            <MessageModal
                isOpen={showMessage.show}
                onClose={() => setShowMessage({ show: false, title: '', message: '', type: 'success' })}
                title={showMessage.title}
                message={showMessage.message}
                type={showMessage.type}
            />
        </div>
    );
}

// Render the app
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
