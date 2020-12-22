const questions = [
	{
		type: 'input',
		name: 'clientId',
		message: 'Client ID:',
		validate: (input) => {
			if (!input)
				return 'Please enter a valid client ID.'

			return true
		}
	},
	{
		type: 'input',
		name: 'clientSecret',
		message: 'Client secret:',
		validate: (input) => {
			if (!input)
				return 'Please enter a valid client secret.'

			return true
		}
	},
	{
		type: 'input',
		name: 'code',
		message: `Copy the "code" query parameter and enter it here:`,
		validate: (input) => {
			if (!input)
				return 'Please enter the authorization code.';

			return true
		}
	}
]

export default questions;
