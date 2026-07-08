param(
  [string]$ProjectRef = "bfagvdlizifegmskainn"
)

$ErrorActionPreference = "Stop"

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class WindowsCredentialReader
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct Credential
    {
        public UInt32 Flags;
        public UInt32 Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public UInt32 CredentialBlobSize;
        public IntPtr CredentialBlob;
        public UInt32 Persist;
        public UInt32 AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("advapi32.dll", SetLastError = true)]
    private static extern void CredFree(IntPtr credentialPtr);

    public static string Read(string target)
    {
        IntPtr credentialPtr;
        if (!CredRead(target, 1, 0, out credentialPtr))
            throw new System.ComponentModel.Win32Exception(Marshal.GetLastWin32Error());

        try
        {
            Credential credential = Marshal.PtrToStructure<Credential>(credentialPtr);
            byte[] secret = new byte[credential.CredentialBlobSize];
            Marshal.Copy(credential.CredentialBlob, secret, 0, secret.Length);
            return System.Text.Encoding.UTF8.GetString(secret).TrimEnd('\0');
        }
        finally
        {
            CredFree(credentialPtr);
        }
    }
}
"@

$accessToken = [WindowsCredentialReader]::Read("Supabase CLI:supabase")
$endpoint = "https://api.supabase.com/v1/projects/$ProjectRef/config/auth"
$headers = @{ Authorization = "Bearer $accessToken" }

$confirmation = @'
<!doctype html>
<html lang="es">
  <body style="margin:0;background:#f6f2e8;font-family:Arial,sans-serif;color:#26352f">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f6f2e8">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:24px;border:1px solid #dbe5dc;padding:32px">
          <tr><td>
            <p style="margin:0 0 8px;color:#47845c;font-size:15px;font-weight:700">VOLVER A MÍ</p>
            <h1 style="margin:0 0 16px;font-size:28px">Confirmá tu cuenta</h1>
            <p style="margin:0 0 24px;line-height:1.6">Recibiste este correo porque creaste una cuenta en Volver a Mí. Confirmá tu dirección para empezar a crear tu personaje y guardar tu progreso.</p>
            <p style="margin:0 0 24px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#5da56f;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:14px">Confirmar mi cuenta</a></p>
            <p style="margin:0;color:#68756f;font-size:13px;line-height:1.5">Si no creaste esta cuenta, podés ignorar este mensaje.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
'@

$recovery = @'
<!doctype html>
<html lang="es">
  <body style="margin:0;background:#f6f2e8;font-family:Arial,sans-serif;color:#26352f">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f6f2e8">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:24px;border:1px solid #dbe5dc;padding:32px">
          <tr><td>
            <p style="margin:0 0 8px;color:#47845c;font-size:15px;font-weight:700">VOLVER A MÍ</p>
            <h1 style="margin:0 0 16px;font-size:28px">Recuperá tu contraseña</h1>
            <p style="margin:0 0 24px;line-height:1.6">Recibimos una solicitud para cambiar la contraseña de tu cuenta de Volver a Mí.</p>
            <p style="margin:0 0 24px"><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#5da56f;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:14px">Crear una nueva contraseña</a></p>
            <p style="margin:0;color:#68756f;font-size:13px;line-height:1.5">Si no pediste este cambio, ignorá el mensaje: tu contraseña seguirá siendo la misma.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
'@

$body = @{
  mailer_subjects_confirmation = "Confirmá tu cuenta de Volver a Mí"
  mailer_templates_confirmation_content = $confirmation
  mailer_subjects_recovery = "Recuperá tu cuenta de Volver a Mí"
  mailer_templates_recovery_content = $recovery
} | ConvertTo-Json -Depth 4

Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Patch -ContentType "application/json" -Body $body | Out-Null

$config = Invoke-RestMethod -Uri $endpoint -Headers $headers -Method Get
[pscustomobject]@{
  ConfirmationSubject = $config.mailer_subjects_confirmation
  RecoverySubject = $config.mailer_subjects_recovery
  ConfirmationTemplateLength = ([string]$config.mailer_templates_confirmation_content).Length
  RecoveryTemplateLength = ([string]$config.mailer_templates_recovery_content).Length
}
