-- Habilitar RLS para todas as tabelas
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para bookings
CREATE POLICY "Bookings são visíveis para todos os usuários autenticados"
ON bookings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Apenas admins podem criar reservas"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (
    auth.role() = 'admin' OR 
    EXISTS (
        SELECT 1 FROM courts c
        WHERE c.id = court_id
        AND c.status = 'active'
        AND NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.court_id = court_id
            AND b.day = day
            AND b.time = time
            AND b.status = 'active'
        )
    )
);

CREATE POLICY "Apenas admins podem atualizar reservas"
ON bookings FOR UPDATE
TO authenticated
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Apenas admins podem deletar reservas"
ON bookings FOR DELETE
TO authenticated
USING (auth.role() = 'admin');

-- Políticas para courts
CREATE POLICY "Quadras são visíveis para todos"
ON courts FOR SELECT
TO authenticated
USING (status = 'active');

CREATE POLICY "Apenas admins podem gerenciar quadras"
ON courts FOR ALL
TO authenticated
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

-- Políticas para booking_settings
CREATE POLICY "Configurações são visíveis para todos"
ON booking_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Apenas admins podem gerenciar configurações"
ON booking_settings FOR ALL
TO authenticated
USING (auth.role() = 'admin')
WITH CHECK (auth.role() = 'admin');

-- Funções de validação
CREATE OR REPLACE FUNCTION validate_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se a quadra existe e está ativa
    IF NOT EXISTS (SELECT 1 FROM courts WHERE id = NEW.court_id AND status = 'active') THEN
        RAISE EXCEPTION 'Quadra não encontrada ou inativa';
    END IF;

    -- Verificar se o horário está disponível
    IF EXISTS (
        SELECT 1 FROM bookings 
        WHERE court_id = NEW.court_id 
        AND day = NEW.day 
        AND time = NEW.time 
        AND status = 'active'
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'Horário já reservado';
    END IF;

    -- Verificar formato do WhatsApp
    IF NOT NEW.whatsapp ~ '^[0-9]{10,11}$' THEN
        RAISE EXCEPTION 'Formato de WhatsApp inválido';
    END IF;

    -- Verificar email se fornecido
    IF NEW.email IS NOT NULL AND NOT NEW.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Formato de email inválido';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validação de reservas
CREATE TRIGGER validate_booking_trigger
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION validate_booking();
