import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ClientHeader from './components/ClientHeader';
import WeekStrip from './components/WeekStrip';
import DailyWorkoutView from './components/DailyWorkoutView';
import PwaPrompt from './components/PwaPrompt';
import ToastContainer from './components/ToastContainer';
import { getClients, deleteClient, getClientPlans } from './lib/api';
import { formatDateISO } from './lib/utils';
import { subscribeAuthChange } from './lib/pocketbase';
import { showToast } from './lib/toastStore';
import { Users, Plus } from 'lucide-react';

const PlanBuilderModal = lazy(() => import('./components/PlanBuilderModal'));
const ClientManagerModal = lazy(() => import('./components/ClientManagerModal'));
const LoginModal = lazy(() => import('./components/LoginModal'));

export default function App() {
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedDateStr, setSelectedDateStr] = useState(() => formatDateISO(new Date()));

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientPlans, setClientPlans] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const fetchClientPlans = useCallback(async (clientId) => {
    try {
      const plans = await getClientPlans(clientId);
      setClientPlans(plans);
    } catch (e) {
      console.error('[App:fetchClientPlans] Failed to load client plans:', e);
    }
  }, []);

  const loadClientsData = useCallback(async () => {
    try {
      setLoadingClients(true);
      const data = await getClients();
      setClients(data);

      if (data && data.length > 0) {
        setSelectedClient(prev => {
          if (!prev || !data.some(c => c.id === prev.id)) {
            fetchClientPlans(data[0].id);
            return data[0];
          }
          return prev;
        });
      } else {
        setSelectedClient(null);
        setClientPlans([]);
      }
    } catch (err) {
      console.error('[App:loadClientsData] Failed to load clients:', err);
    } finally {
      setLoadingClients(false);
    }
  }, [fetchClientPlans]);

  useEffect(() => {
    loadClientsData();

    const unsubscribe = subscribeAuthChange(() => {
      loadClientsData();
    });

    return () => unsubscribe();
  }, [loadClientsData]);

  const handleSelectClient = useCallback((client) => {
    setSelectedClient(client);
    fetchClientPlans(client.id);
  }, [fetchClientPlans]);

  const handleDeleteClient = useCallback(async (clientId) => {
    try {
      await deleteClient(clientId);
      await loadClientsData();
    } catch (e) {
      console.error('[App:handleDeleteClient] Failed to delete client:', e);
    }
  }, [loadClientsData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 pb-24 md:pb-12">
      <ToastContainer />

      <Header
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={handleSelectClient}
        onOpenNewClientModal={() => setIsNewClientOpen(true)}
        onOpenLoginModal={() => setIsLoginOpen(true)}
      />

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPlanBuilder={() => {
          if (!selectedClient) {
            showToast('Por favor selecciona o crea un cliente primero', 'info');
            setIsNewClientOpen(true);
            return;
          }
          setIsPlanBuilderOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {!loadingClients && clients.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center my-6">
            <Users className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Bienvenido a Venefit</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Agrega un cliente para comenzar a crear planes de entrenamiento y registrar rutinas.
            </p>
            <button
              onClick={() => setIsNewClientOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Agregar Primer Cliente
            </button>
          </div>
        )}

        {selectedClient && activeTab === 'workout' && (
          <div>
            <ClientHeader
              client={selectedClient}
              plans={clientPlans}
              onOpenPlanBuilder={() => setIsPlanBuilderOpen(true)}
              onDeleteClient={handleDeleteClient}
            />

            <WeekStrip
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
            />

            <DailyWorkoutView
              clientId={selectedClient.id}
              dateStr={selectedDateStr}
              onOpenPlanBuilder={() => setIsPlanBuilderOpen(true)}
            />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Lista de Clientes</h2>
              <button
                onClick={() => setIsNewClientOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" /> Nuevo Cliente
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    handleSelectClient(c);
                    setActiveTab('workout');
                  }}
                  className={`bg-slate-900 border rounded-2xl p-4 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedClient && selectedClient.id === c.id 
                      ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-base border border-slate-700 shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{c.goal || 'Sin objetivo registrado'}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Peso: <strong className="text-slate-200">{c.current_weight || '-'} kg</strong></span>
                    <span>Altura: <strong className="text-slate-200">{c.height || '-'} cm</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Suspense fallback={null}>
        {selectedClient && isPlanBuilderOpen && (
          <PlanBuilderModal
            isOpen={isPlanBuilderOpen}
            onClose={() => setIsPlanBuilderOpen(false)}
            clientId={selectedClient.id}
            onPlanCreated={() => {
              fetchClientPlans(selectedClient.id);
            }}
          />
        )}

        {isNewClientOpen && (
          <ClientManagerModal
            isOpen={isNewClientOpen}
            onClose={() => setIsNewClientOpen(false)}
            onClientCreated={(newClient) => {
              loadClientsData();
              handleSelectClient(newClient);
            }}
          />
        )}

        {isLoginOpen && (
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginSuccess={() => loadClientsData()}
          />
        )}
      </Suspense>

      <PwaPrompt />
    </div>
  );
}
