import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: 'black',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: 'black',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 0,
    marginBottom: 8,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 8,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'black',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: 'black',
  },
  checkboxLabel: {
    fontSize: 14,
    color: 'black',
  },
  forgotPassword: {
    color: 'black',
    fontSize: 14,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 16,
    padding: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 4,
  },
  button: {
    backgroundColor: 'black',
    height: 50,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 2,
    backgroundColor: 'black',
  },
  dividerText: {
    color: 'black',
    fontWeight: '700',
    letterSpacing: 1,
    marginHorizontal: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 0,
    marginBottom: 16,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  socialButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '500',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  facebookButtonText: {
    color: 'white',
  },
  termsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
    marginTop: 24,
  },
  termsLink: {
    color: 'black',
    textDecorationLine: 'underline',
  },
  link: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
}); 