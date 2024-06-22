import { useEffect, useRef, useState } from 'react'
import TextField from "../../../shared/TextField";
import styles from "./styles.module.scss";
import dollarUp from '../../../../icons/dollar_up.svg'
import dollarDown from '../../../../icons/dollar_down.svg'
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { Form } from '../../../../types/form';
import { money } from '../../../../utils/money-mask';
import { phone } from '../../../../utils/phone-mask';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'

const typeOptions = {
  left: 'unica vez',
  right: 'mensalidade'
} as const;

const formSchema = z.object({
  tel: z.number({ required_error: 'Campo obrigatório'}).min(9999999999, 'Deve ter 11 dígitos'),
  name: z.string({ required_error: 'Campo obrigatório'}).min(1, 'Campo obrigatório')
})

export default function Form() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Form>({
    defaultValues: {
      type: typeOptions.left,
      value: 0,
      name: ''
    },
    resolver: zodResolver(formSchema)
  });
  const [sucess, setSucess] = useState(false);
  const [loading, setLoading] = useState(false)
  const values = {
    type: watch('type'),
    tel: watch('tel'),
    value: watch('value')
  };
  const typeOptionRef = {
    left: useRef<HTMLLabelElement | null>(null),
    right: useRef<HTMLLabelElement | null>(null)
  };

  const submitForm: SubmitHandler<Form> = async (data) => {
    try {
      setLoading(true);
      const payload:Form = {
        name: data.name,
        tel: data.tel,
        type: values.type,
        value: values.value
      }
      await fetch('/api/search.json', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-type": "application/json"
        }
      })
      setSucess(true)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>, side: 'left' | 'right') => {
    if (e.code === 'Enter') {
      const type = typeOptions[side];
      setValue('type', type)
    }

    if (side === 'left' && e.code === 'ArrowRight') {
      typeOptionRef.right.current?.focus()
    }

    if (side === 'right' && e.code === 'ArrowLeft') {
      typeOptionRef.left.current?.focus()
    }
  }

  return (
    <section className={styles.form_wrapper}>
      <h3 tabIndex={0}>Nos ajude a melhorar!</h3>
      <div className={styles.form} id="pesquisa">
        <aside >
          <h4 tabIndex={0}>Participe da nossa pesquisa de expectativas</h4>
          <p tabIndex={0}>
            Esta pesquisa é dedicada a compreender melhor o nosso público-alvo:
            estabelecimentos que desejam ou precisam automatizar e simplificar
            diversas tarefas. Com esta pesquisa, poderemos alinhar suas
            expectativas ao nosso sistema, ajudando-nos a oferecer a melhor
            ferramenta para o seu negócio com o melhor custo-benefício.
          </p>
        </aside>
        {sucess ? (
          <div className={styles.sucess}><span>Obrigado por participar!</span></div>
        ) : (
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
              value={phone.apply(String(values.tel))}
              onChange={e => setValue('tel', Number(phone.clean(e.target.value)) || 0)}
              error={errors.tel?.message}
            />
            <div>
              <span tabIndex={0}>
                Qual opção seria mais interessante para a sua empresa: efetuar um
                pagamento único ou optar por uma mensalidade com um valor reduzido?
              </span>
              <div tabIndex={0} className={styles.card_grid} aria-label="Escolha uma das proximas opções">
                <label tabIndex={0} onKeyDown={(e) => handleKeyDown(e, 'left')} ref={typeOptionRef.left}>
                  <div className={styles.card}>
                    <img src={dollarUp.src} alt="imagem de dinheiro com seta para cima"/>
                    <span>Prefiro ter que pagar somente uma vez</span>
                    <input type="radio" value="unica vez" checked={values.type == typeOptions.left} {...register('type')} onChange={() => setValue('type', typeOptions.left)} />
                  </div>
                </label>
                <label tabIndex={0} onKeyDown={(e) => handleKeyDown(e, 'right')} ref={typeOptionRef.right}>
                  <div className={styles.card} >
                    <img src={dollarDown.src} alt="imagem de dinheiro com seta para baixo"/>
                    <span>Prefiro pagar uma mensalidade</span>
                    <input type="radio" value="mensalidade" checked={values.type == typeOptions.right} {...register('type')} onChange={() => setValue('type', typeOptions.right)} />
                  </div>
                </label>
              </div>
            </div>
            <TextField
              title="Qual valor a sua empresa estaria disposta a pagar, considerando a resposta à pergunta anterior?"
              placeholder="Digite o valor"
              name="value"
              value={money.apply(values.value)}
              onChange={e => setValue('value', money.clean(e.target.value))}
            />
            <div className={styles.btn_box}>
              <button disabled={loading} className={styles.btn_send}>Enviar</button>
            </div>
          </form>
        )}
      </div>

    </section>
  );
} 
