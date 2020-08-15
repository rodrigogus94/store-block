import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
// @ts-ignore
import useProduct from "vtex.product-context/useProduct"
import productReleaseDate from './queries/productReleaseDate.graphql'



interface CountdownProps {
  targetDate: string

}

const productContext = useProduct()
const product = productContext?.product
const linkText = product?.linkText
const CSS_HANDLES = ["countdown"]
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()
const Countdown: StorefrontFunctionComponent<CountdownProps> = () => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)

  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  })
  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }
  if (!product) {
    return (
      <div>
        <span>Não há contexto de produto</span>
      </div>
    )
  }
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  return (
    <div>
      <div className={`${handles.countdown} db tc`}>
        <h1> {timeRemaining.hours}:{timeRemaining.minutes}:{timeRemaining.seconds} </h1>
      </div>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {



  },

}

export default Countdown
