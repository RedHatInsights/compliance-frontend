import { COMPLIANCE_API_ROOT } from '@/constants';
import normalize from 'json-api-normalizer';
import useApi from './useApi';

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
    Object.entries(entity?.relationships || []).forEach((item) => {
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
    return Object.values(jsonNormalized[type] || {})?.map((entity) => (
        includeRelationship(includeAttributes(entity), jsonNormalized)
    ));
};

const fetchCollection = async (apiClient, collection, params = {}, options = {}) => {
    const json = await apiClient.get(`/${ collection }`, { params });
    const normalized = normalizeData(json, options?.type || collection);

    return {
        collection: normalized,
        meta: json.meta,
        total: json.meta.total,
        json
    };
};

const useCollection = (collection, options = {}) => {
    const apiClient = useApi({
        apiBase: COMPLIANCE_API_ROOT
    });
    const params = {
        ...(options?.params || {}),
        include: (options?.include || [])
    };

    return fetchCollection(apiClient, collection, params, options?.collection);
};

export default useCollection;
