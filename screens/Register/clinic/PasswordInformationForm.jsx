import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { KeyRound, ArrowRight } from "lucide-react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { BackHeader } from "../../../components/ui/BackHeader";
import Stepper from "../../../components/ui/Stepper";
import { ErrorBanner } from "../../../components/ui/ErrorBanner";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PasswordInformationFormClinic(props) {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Critérios de senha
  const criteria = [
    { label: 'Mínimo de 8 caracteres', valid: senha.length >= 8 },
    { label: 'Letra maiúscula', valid: /[A-Z]/.test(senha) },
    { label: 'Número', valid: /[0-9]/.test(senha) },
    { label: 'Caractere especial', valid: /[^A-Za-z0-9]/.test(senha) },
  ];
  const allCriteriaMet = criteria.every(c => c.valid);

  // Força da senha: 0 = fraca, 1 = média, 2 = forte
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return 0; // fraca
    if (score === 2 || score === 3) return 1; // média
    return 2; // forte
  };

  const strength = getPasswordStrength(senha);
  const strengthLabels = ["Fraca", "Média", "Forte"];
  // Cores: fraca = vermelha, média = laranja, forte = verde
  const getBarColor = (barIndex) => {
    if (strength === 2) return '#10b981'; // forte: todas verdes
    if (strength === 1) return barIndex < 2 ? '#f59e42' : '#e5e7eb'; // média: duas laranjas
    if (strength === 0) return barIndex === 0 ? '#ef4444' : '#e5e7eb'; // fraca: só a primeira vermelha
    return '#e5e7eb';
  };
  const getStrengthTextColor = () => {
    if (strength === 2) return '#10b981';
    if (strength === 1) return '#f59e42';
    if (strength === 0) return '#ef4444';
    return '#6b7280';
  };

  const isValid = senha.trim() && confirmar.trim() && senha === confirmar && (strength === 2 && allCriteriaMet);

  const handleCriarSenha = () => {
    if (!senha || !confirmar) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (!(strength === 2 && allCriteriaMet)) {
      setErro("A senha precisa ser forte e atender todos os requisitos.");
      return;
    }
    setErro("");
    if (props.onConfirm) props.onConfirm(senha);
    navigation.navigate("ConfirmRegisterClinic");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <ErrorBanner visible={!!erro} title={erro} onClose={() => setErro("")} />
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={5} currentStep={5} />
      
      {/* Conteúdo principal com scroll */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <View style={{ marginTop: 24 }}>
              <Text className="text-2xl font-bold mb-2">Agora vamos criar uma Senha!</Text>
              <Text className="text-lg text-gray-500 mb-4">
                Crie uma senha forte que será usada para fazer login. {"\n\n"}A senha deve conter letras minúsculas e maiúsculas, números e caracteres especiais.
              </Text>
              <Input
                label="Crie uma Senha"
                placeholder="Digite sua senha aqui"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                icon={<KeyRound size={18} color="#A0AEC0" />}
              />
              {/* Mensagem de erro personalizada para requisitos não atendidos */}
              {senha.length > 0 && !(strength === 2 && allCriteriaMet) && (
                <View style={{ marginTop: 8 }}>
                  <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 14, marginBottom: 2 }}>
                    Para criar a senha, atenda todos os requisitos:
                  </Text>
                  {criteria.filter(c => !c.valid).map((c, idx) => (
                    <Text key={idx} style={{ color: '#ef4444', fontSize: 13 }}>• {c.label}</Text>
                  ))}
                </View>
              )}
              {/* Indicador de força de senha com 3 barras */}
              {senha.length > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 2 }}>
                  {[0,1,2].map((i) => (
                    <View
                      key={i}
                      style={{
                        flex: 1,
                        height: 8,
                        marginHorizontal: 3,
                        borderRadius: 4,
                        backgroundColor: getBarColor(i),
                      }}
                    />
                  ))}
                  <Text style={{ marginLeft: 10, color: getStrengthTextColor(), fontWeight: 'bold', fontSize: 13 }}>
                    {strengthLabels[strength]}
                  </Text>
                </View>
              )}
              <Input
                label="Digite novamente a Senha"
                placeholder="Digite sua senha aqui"
                value={confirmar}
                onChangeText={setConfirmar}
                secureTextEntry
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botão fixo na parte inferior */}
      <View style={{ 
        paddingHorizontal: 24, 
        paddingBottom: insets.bottom + 24, 
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6'
      }}>
        <Button onPress={handleCriarSenha} icon={<ArrowRight size={18} color="white" />} disabled={!isValid}>
          Próximo
        </Button>
      </View>
    </View>
  );
}
