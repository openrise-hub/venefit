import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Card, CardContent, Button } from '@heroui/react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ClientHeader from './components/ClientHeader';
import WeekStrip from './components/WeekStrip';
import DailyWorkoutView from './components/DailyWorkoutView';
import WeeklyOverviewView from './components/WeeklyOverviewView';
import AuthView from './components/AuthView';
import PwaPrompt from './components/PwaPrompt';
import ToastContainer from './components/ToastContainer';
import DemoBanner from './components/DemoBanner';
import { getClients, deleteClient, getClientPlans } from './lib/api';
import { formatDateISO } from './lib/utils';
import { subscribeAuthChange, isTrainerAuthenticated, isDevSession } from './lib/pocketbase';
import { showToast } from './lib/toastStore';
import { Users, Plus, Edit3 } from 'lucide-react';
import { Client, ClientPlan } from './types';
import EditClientModal from './components/EditClientModal';

const PlanBuilderModal = lazy(() => import('./components/PlanBuilderModal'));
const ClientOnboardingModal = lazy(() => import('./components/ClientOnboardingModal'));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isTrainerAuthenticated());
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedDateStr, setSelectedDateStr] = useState(() => formatDateISO(new Date()));
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientPlans, setClientPlans] = useState<ClientPlan[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const fetchClientPlans = useCallback(async (clientId: string) => {
    try {
      const plans = await getClientPlans(clientId);
      setClientPlans(plans);
    } catch (e) {
      console.error('[App:fetchClientPlans] Failed to load client plans:', e);
    }
  }, []);

  const loadClientsData = useCallback(async (targetClientId?: string) => {
    if (!isTrainerAuthenticated()) {
      setClients([]);
      setSelectedClient(null);
      setClientPlans([]);
      setLoadingClients(false);
      return;
    }

    try {
      setLoadingClients(true);
      const data = await getClients();
      setClients(data);

      if (data && data.length > 0) {
        const found = targetClientId ? data.find(c => c.id === targetClientId) : null;
        const toSelect = found || data[0];
        setSelectedClient(toSelect);
        fetchClientPlans(toSelect.id);
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
      const auth = isTrainerAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        loadClientsData();
      } else {
        setClients([]);
        setSelectedClient(null);
        setClientPlans([]);
      }
    });

    return () => unsubscribe();
  }, [loadClientsData]);

  const handleSelectClient = useCallback((client: Client) => {
    setSelectedClient(client);
    fetchClientPlans(client.id);
  }, [fetchClientPlans]);

  const handleDeleteClient = useCallback(async (clientId: string) => {
    try {
      await deleteClient(clientId);
      await loadClientsData();
    } catch (e) {
      console.error('[App:handleDeleteClient] Failed to delete client:', e);
    }
  }, [loadClientsData]);

  const handleUpdateClient = useCallback((updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setSelectedClient(prev => (prev && prev.id === updatedClient.id ? updatedClient : prev));
  }, []);

  const handleOpenNewClient = useCallback(() => {
    setIsNewClientOpen(true);
  }, []);

  const handleOpenPlanBuilder = useCallback(() => {
    if (!selectedClient) {
      showToast('Por favor selecciona o crea un cliente primero', 'info');
      setIsNewClientOpen(true);
      return;
    }
    setIsPlanBuilderOpen(true);
  }, [selectedClient]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen font-sans antialiased">
        <ToastContainer />
        <AuthView onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  const isDemo = isDevSession();

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased pb-24 md:pb-12 bg-background text-foreground transition-colors">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:font-black focus:rounded-xl focus:shadow-xl"
      >
        Saltar al contenido principal
      </a>

      <ToastContainer />

      {isDemo && (
        <DemoBanner onResetData={() => loadClientsData()} />
      )}

      <Header
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={handleSelectClient}
        onOpenNewClientModal={handleOpenNewClient}
      />

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPlanBuilder={handleOpenPlanBuilder}
      />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {!loadingClients && clients.length === 0 && (
          <Card className="my-6 border border-border shadow-xs">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Users className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-foreground">Bienvenido a Venefit</h3>
              <p className="text-xs text-muted max-w-sm mb-4 leading-relaxed">
                Agrega un cliente para comenzar a crear planes de entrenamiento y registrar rutinas.
              </p>
              <Button
                variant="primary"
                size="sm"
                onPress={handleOpenNewClient}
                aria-label="Agregar primer cliente"
                className="font-bold shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>Agregar Primer Cliente</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedClient && activeTab === 'workout' && (
          <div>
            <ClientHeader
              client={selectedClient}
              plans={clientPlans}
              onOpenPlanBuilder={handleOpenPlanBuilder}
              onDeleteClient={handleDeleteClient}
              onUpdateClient={handleUpdateClient}
            />

            <WeekStrip
              selectedDateStr={selectedDateStr}
              onSelectDate={setSelectedDateStr}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
            />

            {viewMode === 'daily' ? (
              <DailyWorkoutView
                key={`${selectedClient.id}-${selectedDateStr}`}
                clientId={selectedClient.id}
                dateStr={selectedDateStr}
                onOpenPlanBuilder={handleOpenPlanBuilder}
              />
            ) : (
              <WeeklyOverviewView
                clientId={selectedClient.id}
                selectedDateStr={selectedDateStr}
                onSelectDate={setSelectedDateStr}
                onSwitchToDailyView={() => setViewMode('daily')}
                onOpenPlanBuilder={handleOpenPlanBuilder}
              />
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground">Lista de Clientes</h2>
              <Button
                variant="primary"
                size="sm"
                onPress={handleOpenNewClient}
                aria-label="Crear nuevo cliente"
                className="font-bold shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>Nuevo Cliente</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Seleccionar cliente ${c.name}, objetivo: ${c.goal || 'Sin objetivo registrado'}`}
                  onClick={() => {
                    handleSelectClient(c);
                    setActiveTab('workout');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectClient(c);
                      setActiveTab('workout');
                    }
                  }}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2 rounded-2xl"
                >
                  <Card className="border border-border bg-surface hover:border-foreground/30 transition-all shadow-2xs">
                    <CardContent className="p-4 flex flex-col justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black flex items-center justify-center text-base shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-foreground truncate">{c.name}</h4>
                          <p className="text-xs text-muted mt-0.5 truncate">{c.goal || 'Sin objetivo registrado'}</p>
                        </div>
                      </div>

                      <div className="border-t border-border pt-3 mt-3 flex items-center justify-between text-xs text-muted">
                        <div className="flex items-center gap-3">
                          <span>Peso: <strong className="text-foreground tabular-nums">{c.current_weight || '-'}&nbsp;kg</strong></span>
                          <span>Altura: <strong className="text-foreground tabular-nums">{c.height || '-'}&nbsp;cm</strong></span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg"
                          onPress={() => {
                            setEditingClient(c);
                          }}
                          aria-label={`Editar datos de ${c.name}`}
                        >
                          <Edit3 className="w-3 h-3 mr-1" aria-hidden="true" />
                          <span>Editar</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
            client={selectedClient}
            existingPlans={clientPlans}
            onPlanCreated={() => {
              fetchClientPlans(selectedClient.id);
            }}
          />
        )}

        {isNewClientOpen && (
          <ClientOnboardingModal
            isOpen={isNewClientOpen}
            onClose={() => setIsNewClientOpen(false)}
            onClientCreated={(newClient) => {
              loadClientsData(newClient.id);
              setActiveTab('workout');
            }}
          />
        )}
      </Suspense>

      {editingClient && (
        <EditClientModal
          isOpen={Boolean(editingClient)}
          onClose={() => setEditingClient(null)}
          client={editingClient}
          onClientUpdated={handleUpdateClient}
        />
      )}

      <PwaPrompt />
    </div>
  );
}
