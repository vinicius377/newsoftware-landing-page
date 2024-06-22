import React, { useEffect, useRef, useState } from 'react'
import TextField from "../../../shared/TextField";
import styles from "./styles.module.scss";
import dollarUp from '../../../../icons/dollar_up.svg'
import dollarDown from '../../../../icons/dollar_down.svg'
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Form } from '../../../../types/form'; 

export default function Form() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { register, handleSubmit } = useForm<Form>();
  const [sucess, setSucess] = useState(false);
  const [loading, setLoading] = useState(false)
;
  const submitForm:SubmitHandler<Form> = async (data) => {
    try {
      setLoading(true)
      await fetch('/api/search.json', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json"
        }
      })
      setSucess(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const event = () => {
      if (!sectionRef.current) return;

      if (sectionRef.current.getBoundingClientRect().top < window.innerHeight) {
        sectionRef.current.classList.add('active')
      }
    }
    window.addEventListener('scroll', event)
    event()
    return () => {
      window.removeEventListener('scroll', event)
    }
  }, [sectionRef])

  return (
    <section className={styles.form} id="pesquisa" ref={sectionRef}>
      <aside>
        <h4>Participe da nossa pesquisa de expectativas</h4>
        <p>
          Esta pesquisa é dedicada a compreender melhor o nosso público-alvo:
          estabelecimentos que desejam ou precisam automatizar e simplificar
          diversas tarefas. Com esta pesquisa, poderemos alinhar suas
          expectativas ao nosso sistema, ajudando-nos a oferecer a melhor
          ferramenta para o seu negócio com o melhor custo-benefício.
        </p>
      </aside>
      {sucess ? (
        <div className={styles.sucess}><span>Obrigado por participar!</span></div>
      ): (
        <form onSubmit={handleSubmit(submitForm)}>
        <TextField
          title="Nome"
          required
          placeholder="Digite seu nome"
          name="name"
          register={register}
        />
        <TextField
          title="Telefone"
          required
          placeholder="Digite seu telefone"
          name="tel"
          register={register}
        />
        <div>
          <span>
            Qual opção seria mais interessante para a sua empresa: efetuar um
            pagamento único ou optar por uma mensalidade com um valor reduzido?
          </span>
          <div className={styles.card_grid}>
            <label>
              <div className={styles.card}>
                <img src={dollarUp.src}/>
                <span>Prefiro ter que pagar somente uma vez</span>
                <input type="radio" value="unica vez" {...register('type')} />
              </div>
            </label>
            <label>
              <div className={styles.card}>
                <img src={dollarDown.src}/>
                <span>Prefiro pagar uma mensalidade</span>
                <input type="radio" value="mensalidade" {...register('type')} />
              </div>
            </label>
          </div>
        </div>
        <TextField
          title="Qual valor a sua empresa estaria disposta a pagar, considerando a resposta à pergunta anterior?"
          placeholder="Digite o valor"
          name="value"
          register={register}
        />
        <div className={styles.btn_box}>
          <button disabled={loading} className={styles.btn_send}>Enviar</button>
        </div>
      </form>
      )}
    </section>
  );
} 
