// 📋 LISTA DE CREDENCIALES FALTANTES POR IMPLEMENTAR
// Credenciales que se esperan tener según los nodos implementados

const missingCredentials = [
  // AI/ML Services
  'openaiApi',
  'azureOpenAiApi',
  'googleCloudNaturalLanguageApi',
  'tensorflowApi',
  'pytorchApi',
  'huggingFaceApi',
  'langchainApi',
  'pineconeApi',
  'weaviateApi',
  'milvusApi',
  'mlflowApi',
  'kubeflowApi',
  'replicateApi',
  'stabilityAiApi',

  // Cloud & DevOps
  'awsCloudWatchApi',
  'awsSecretsManagerApi',
  'azureKeyVaultApi',
  'googleSecretManagerApi',
  'hashicorpVaultApi',
  'awsEcsApi',
  'azureFunctionsApi',
  'googleCloudBuildApi',
  'kubernetesApi',
  'terraformCloudApi',
  'ansibleTowerApi',
  'dockerHubApi',
  'azureContainerRegistryApi',
  'digitalOceanKubernetesApi',
  'vercelApi',

  // CRM & Sales
  'zendeskApi',
  'freshdeskApi',
  'pipedriveApi', // Ya implementado
  'mailchimpApi',
  'constantContactApi',
  'convertkitApi',
  'sendpulseApi',
  'gainsightApi',
  'driftApi',
  'apolloIoApi',

  // E-commerce & Payments
  'stripeCheckoutApi',
  'stripeConnectApi',
  'gocardlessApi',
  'wiseApi',
  'coinbaseApi',
  'etsyApi',
  'bigcommerceApi',
  'recartApi',
  'lemonSqueezyApi',
  'paddleApi',

  // Databases & Data Warehouse
  'dynamodbApi', // Ya implementado como 'aws'
  'snowflakeApi',
  'bigqueryApi',
  'redshiftApi',
  'vectorDbApi',

  // Communication & Productivity
  'discordApi', // Ya implementado parcialmente
  'telegramApi', // Ya implementado parcialmente
  'zoomApi',
  'outlookCalendarApi',
  'calendlyApi',
  'miroApi',
  'figmaApi',
  'googleVoiceApi',

  // IoT & Hardware
  'mqttApi',
  'modbusApi',
  'bacnetApi',
  'lorawanApi',
  'edgeDeviceApi',

  // Other Services
  'googleMapsApi',
  'openStreetMapApi',
  'firebaseAdminApi',
  'supabaseAdminApi',
  'auth0Api',
  'oktaApi',
  'intercomApi',
  'freshchatApi',
  'zapierApi',
  'makecomApi',
  'linearApi',
  'jiraServiceManagementApi',
  'pcloudApi',
  'megaApi',
  'webflowApi',
  'contentfulApi',

  // Customer.io y Microsoft Exchange (específicos del proyecto)
  'customerIoApi',
  'microsoftExchangeOAuth2'
];

console.log(`Total de credenciales faltantes: ${missingCredentials.length}`);
console.log('Ejemplos de credenciales faltantes:');
missingCredentials.slice(0, 10).forEach(cred => console.log(`- ${cred}`));
