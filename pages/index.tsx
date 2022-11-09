/* Component props interface */
interface HomeProps {
  count: number;
}

export default function Home(props: HomeProps) {
  return (
      <h1>Contagem: {props.count}</h1>
  )
}

/* Fetching required data for the component */
export const getServerSideProps = async () => {
  /* Getting pools count */
  const response = await fetch('http://localhost:3333/pools/count');
  const data = await response.json();

  /* Making props available to the component */
  return {
    props: {
      count: data.count,
    }
  }
}
