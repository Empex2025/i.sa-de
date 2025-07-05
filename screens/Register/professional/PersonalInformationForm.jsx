import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { BackHeader } from "../../../components/ui/BackHeader";
import { Feather, Mail, User, Phone, IdCard, ChevronRight, ArrowRight } from "lucide-react-native";
import Stepper from "../../../components/ui/Stepper";
import { Link } from "../../../components/ui/Link";
import { useNavigation } from "@react-navigation/native";
import { ConfirmSmsCodeModal } from '../../../components/modals/ConfirmSmsCodeModal';
import { SucessVerificationModal } from '../../../components/modals/SucessVerificationModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalInformationFormProfessional(props) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [checked, setChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const isValid = nome.trim() && cpf.trim() && email.trim() && telefone.trim();

  const handleContinue = () => {
    if (!isValid) return;
    if (!verified) {
      setShowModal(true);
      return;
    }
    navigation.navigate("BasicInformationFormProfessional");
  };

  // Função para formatar CPF
  function formatCpf(value) {
    const cleaned = value.replace(/\D/g, "").slice(0, 11);
    let formatted = cleaned;
    if (cleaned.length > 9) formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    else if (cleaned.length > 6) formatted = cleaned.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (cleaned.length > 3) formatted = cleaned.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    return formatted;
  }

  // Função para formatar telefone
  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numeros;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <BackHeader title="Nova Conta" />
      <Stepper totalSteps={5} currentStep={1} />
      
      {/* Conteúdo principal com scroll */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <Text className="text-2xl font-bold mb-1 mt-4">Vamos começar sua jornada!</Text>
            <Text className="text-lg text-gray-500 mb-4">
             Precisamos dos seus dados para criar sua conta.
            </Text>
            <Input
              label="Nome Completo"
              placeholder="Carlos Magno de Souza"
              icon={<User size={18} color="#A0AEC0" />}
              value={nome}
              onChangeText={setNome}
            />
            <View className="mb-2">
              <Input
                label="CPF"
                placeholder="000.000.000-00"
                className="m-0 p-0"
                icon={<IdCard size={18} color="#A0AEC0" />}
                value={cpf}
                onChangeText={text => setCpf(formatCpf(text))}
              />
              <Link
                onPress={() => {
                  // Aqui você pode abrir um modal explicativo, se desejar
                }}
                variant="muted"
                icon={<ChevronRight size={16} color="#222" />}
              >
                Por que pedimos seu CPF?
              </Link>
            </View>
            <Input
              label="Email"
              placeholder="seuemail@exemplo.com"
              icon={<Mail size={18} color="#A0AEC0" />}
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Número de Telefone"
              placeholder="(00) 00000-0000"
              icon={<Phone size={18} color="#A0AEC0" />}
              value={formatarTelefone(telefone)}
              onChangeText={v => setTelefone(v.replace(/\D/g, "").slice(0, 11))}
            />
          </View>
          <View style={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: Platform.OS === 'android' ? 40 : 24 }}>
            <Text className="text-sm mb-4">
              Ao continuar você concorda com nossos{" "}
              <Link inline variant="black" className="font-semibold" onPress={() => navigation.navigate('Terms')}>Termos de Uso</Link>
              {" "}e{" "}
              <Link inline variant="black" className="font-semibold" onPress={() => navigation.navigate('Polity')}>Política de Privacidade</Link>
              .
            </Text>
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
        <Button
          onPress={handleContinue}
          icon={<ArrowRight size={18} color="white" />}
          disabled={!isValid}
        >
          Continuar
        </Button>
      </View>

      <ConfirmSmsCodeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onVerify={() => {
          setVerified(true);
          setShowModal(false);
          setShowSuccess(true);
        }}
        onResend={() => {}}
        phoneEnding={telefone.slice(-4)}
      />
      <SucessVerificationModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        nextScreen="BasicInformationFormProfessional"
      />
    </View>
  );
}