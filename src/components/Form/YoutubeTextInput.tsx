import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { validationValues } from '../../validation/play'
import type { PlayForm } from './CreateUpdatePlay'

interface YoutubeTextInputProps {
  register: UseFormRegister<PlayForm>
  errors: FieldErrors
  label: keyof PlayForm
  placeholder: string
}

export const YoutubeTextInput = ({ register, errors, label, placeholder }: YoutubeTextInputProps) => {
  return (
    <div className='-mx-3 mb-2 flex flex-wrap'>
      <div className='w-full px-3'>
        <label className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700' htmlFor={label}>
          {placeholder}
        </label>
        <input
          className={`mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none`}
          id={label}
          type='text'
          aria-invalid={errors[label] ? 'true' : 'false'}
          {...register(label, validationValues.youtubeId)}
          placeholder={'https://www.youtube.com/embed/___________'}
        />
        {errors[label] && errors[label]?.type === 'required' && (
          <span role='alert' className='text-xs italic text-red-600'>
            {placeholder} is required
          </span>
        )}
        {errors[label] && errors[label]?.type === 'pattern' && (
          <span role='alert' className='text-xs italic text-red-600'>
            {placeholder} does not match id format
          </span>
        )}
      </div>
    </div>
  )
}