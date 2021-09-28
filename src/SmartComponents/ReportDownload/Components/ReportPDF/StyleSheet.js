import { StyleSheet } from '@react-pdf/renderer';

// Supported style properties see: https://react-pdf.org/styling
export default StyleSheet.create({
  // TODO: bold rendering in PDF does not appear to work
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },

  metaTitle: {
    color: '#C9190B',
    marginBottom: '20px',
  },

  userNotes: {
    backgroundColor: '#F0F0F0',
    padding: '8px',
  },
  userNotesTitle: {
    marginBottom: '4px',
  },

  sectionTitle: {
    color: '#C9190B',
    fontWeight: 'bold',
    fontSize: 14,
  },

  subSectionTitle: {
    color: '#C9190B',
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: '10pt',
  },
});
