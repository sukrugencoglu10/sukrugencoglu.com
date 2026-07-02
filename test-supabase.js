const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const envvars = {};
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      envvars[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });

  const url = envvars['SUPABASE_URL'] || envvars['NEXT_PUBLIC_SUPABASE_URL'];
  const key = envvars['SUPABASE_SERVICE_ROLE_KEY'] || envvars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  
  if (!url || !key) {
    console.log('Credentials missing');
    return;
  }

  const supabase = createClient(url, key);
  
  console.log('Testing GET from kod_bloklari...');
  const getRes = await supabase.from('kod_bloklari').select('*').limit(1).maybeSingle();
  console.log('GET Result (kod_bloklari):', JSON.stringify(getRes, null, 2));

  console.log('Testing GET from gtm_ekosistemi...');
  const getGtm = await supabase.from('gtm_ekosistemi').select('*').limit(1).maybeSingle();
  console.log('GET Result (gtm_ekosistemi):', JSON.stringify(getGtm, null, 2));

  console.log('Testing GET from kisa_notlar...');
  const getKisaNotlar = await supabase.from('kisa_notlar').select('*').limit(1).maybeSingle();
  console.log('GET Result (kisa_notlar):', JSON.stringify(getKisaNotlar, null, 2));
}

testSupabase();
