import { COMPLIANCE_API_ROOT } from '@/constants';
import ApiClient from 'Utilities/ApiClient';
import normalize from 'json-api-normalizer';

const includePropAndDelete = (entity, prop) => {
    const attributes = entity[prop];
    let newEntity = entity;
    delete newEntity[prop];
    return { ...newEntity, ...attributes };
};

const includeAttributes = (entity) => (
    entity && includePropAndDelete(entity, 'attributes')
);

const includeRelationship = (entity, normalizedJson) => {
    let relationships = {};
    Object.entries(entity.relationships).forEach((item) => {
        const [relationship, relationshipData] = item;
        relationships[relationship] = relationshipData?.data.map((entity) => (
            includeAttributes(normalizedJson?.[entity.type]?.[entity.id])
        )).filter((v) => (!!v));
    });
    delete entity.relationships;
    return { ...entity, ...relationships };
};

const normalizeData = (json, type) => {
    const jsonNormalized = normalize(json);
    const normalized = Object.values(jsonNormalized[type])?.map((entity) => {
        console.log('ENT:', entity);
        return includeRelationship(includeAttributes(entity), jsonNormalized);
    });
    return normalized;
};

const fetchCollection = async (apiClient, type, params) => {
    const json = await apiClient.get(null, {
        params: {
            ...params,
            include: ['profiles', 'testResults']
        }
    });
    const normalized = normalizeData(json, type);
    console.log('Fetch collection', json, normalized)
    return {
        collection: normalized,
        meta: json.meta,
        total: json.meta.total,
        json
    };
};

const useCollection = (collection, options = {}) => {
    const apiClient = new ApiClient({
        apiBase: COMPLIANCE_API_ROOT,
        path: `/${ collection }`
    });
    const params = options?.params || {};
    const type = options?.type || collection;

    return () => fetchCollection(apiClient, type, params);
};

export default useCollection;
