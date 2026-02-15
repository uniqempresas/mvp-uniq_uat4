import { supabase } from './src/lib/supabase';

async function checkUserRole() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.log('No user logged in.');
        return;
    }
    console.log('User ID:', user.id);

    const { data, error } = await supabase
        .from('me_usuario')
        .select('cargo(nome_cargo)')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error('Error fetching role:', error);
    } else {
        console.log('Role Data Structure:', JSON.stringify(data, null, 2));
    }
}

checkUserRole();
