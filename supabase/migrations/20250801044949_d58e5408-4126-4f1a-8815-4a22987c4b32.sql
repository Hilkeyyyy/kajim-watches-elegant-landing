-- Configurar configurações de segurança mais restritivas para OTP
-- Reduzir tempo de expiração do OTP para 10 minutos (600 segundos)

-- Atualizar configuração do auth para OTP mais seguro
UPDATE auth.config 
SET 
  otp_expiry = 600,  -- 10 minutos em segundos
  max_frequency = 60  -- máximo 1 tentativa por minuto
WHERE id = 'otp';

-- Se a configuração não existir, criar
INSERT INTO auth.config (id, otp_expiry, max_frequency) 
VALUES ('otp', 600, 60)
ON CONFLICT (id) DO UPDATE SET 
  otp_expiry = EXCLUDED.otp_expiry,
  max_frequency = EXCLUDED.max_frequency;