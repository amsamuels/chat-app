import * as z from 'zod';

const FormSchema = z.object({
  first_name: z.string().min(3, { message: 'First name is required ' }),
  last_name: z.string().min(3, { message: 'Last name is required' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password needs to be 8 characters' }),
});

export default FormSchema;
