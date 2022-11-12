import { useState, FormEvent } from 'react';

/* Next.js Image object */
import Image from 'next/image';

/* Image files */
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';

/* APÌ communication */
import { api } from '../lib/axios';

/* Component props interface */
interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  /* State to hold pool title */
  const [poolTitle, setPoolTitle] = useState('');

  /* Function to handle creating new pools */
  async function createPool(event: FormEvent) {
    /* Avoids page reloading */
    event.preventDefault();

    try{
      /* Making APi request to create new pool */
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      /* Getting code returned from server */
      const { code } = response.data;

      /* Setting code on user's clipboard and informing */
      await navigator.clipboard.writeText(code);

      alert(`Bolão criado com sucesso, o código (${code}) foi copiado para a área de transferência!`);
    } catch (err) {
      console.log(err);
      alert('Falha ao criar o bolão, tente novamente!');
    };

    /* Clearing pool title */
    setPoolTitle('');

    /* Reloading page, in order to update number of created pools */
    window.location.reload();
  };

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className='mt-16 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text"
            required
            placeholder='Qual o nome do seu bolão?'
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévida a aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
    //<h1 className="text-violet-500 font-bold text-4xl">Contagem: {props.count}</h1>
  )
}

/* Fetching required data for the component */
export const getServerSideProps = async () => {
  /* Making asynchronous API calls to get data */
  const [
    poolCountResponse, 
    guessCountResponse, 
    userCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ]);

  /* Making props available to the component */
  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
