import {
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class AibermApi implements ICredentialType {
  name = 'aibermApi';
  displayName = 'Aiberm API';
  documentationUrl = 'https://aiberm.com/docs';
  icon = 'file:aiberm.svg' as const;
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
    },
  ];

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://aiberm.com/v1',
      url: '/models',
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };
}