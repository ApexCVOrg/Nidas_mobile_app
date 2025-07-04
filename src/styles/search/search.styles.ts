import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInputIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  genderTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  genderTab: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeGenderTab: {
    borderBottomColor: '#000',
  },
  genderTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  swipeText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#F0F0F0', 
  },
  mainBannerContainer: {
    height: 380,
    width: width,
    position: 'relative',
    marginBottom: 20,
  },
  mainBannerImage: {
    width: '100%',
    height: '100%',
  },
  mainBannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  arrowBox: {
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  arrowText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  bannerSubtitle: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  originalsScroll: {
    paddingBottom: 10, 
  },
  originalsContentContainer: {
    justifyContent: 'center',
  },
  productCard: {
    width: 120, 
    marginRight: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  categoryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryLinkIcon: {
    marginRight: 15,
  },
  categoryLinkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  categoryLinkArrow: {
    marginLeft: 15,
  },
  bannerIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  bannerIndicatorSegment: {
    width: 28,
    height: 4,
    marginHorizontal: 3,
    borderRadius: 2,
  },
  bannerIndicatorInactive: {
    backgroundColor: '#bbb',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#bbb',
  },
  bannerIndicatorActive: {
    backgroundColor: '#000',
    borderStyle: 'solid',
    borderWidth: 0,
  },
  bannerTextBox: {
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  // Search functionality styles
  searchSection: {
    position: 'relative',
    zIndex: 1000,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 400,
    zIndex: 1000,
  },
  searchResultsList: {
    maxHeight: 400,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  searchResultPrice: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
    marginBottom: 2,
  },
  searchResultCategory: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  noResultsContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  suggestionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
  },
  suggestionsHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
  },
  // Search Results Screen styles
  searchResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  searchResultsHeaderContent: {
    flex: 1,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  searchResultsQuery: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  resultsCountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  resultsCountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  searchResultsListContainer: {
    padding: 16,
  },
  searchResultsRow: {
    justifyContent: 'space-between',
  },
  searchResultCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  searchResultCardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  searchResultCardInfo: {
    padding: 12,
  },
  searchResultCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    lineHeight: 18,
  },
  searchResultCardPrice: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchResultCardCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  searchResultCardColors: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  moreColorsText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  noResultsFullContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsFullTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsFullText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Nike banner specific styles (banner 3)
  mainBannerOverlayRight: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  bannerTextBoxRight: {
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  bannerTitleRight: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  bannerSubtitleRight: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'right',
  },
  // Collections section styles
  collectionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
  },
  collectionsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 25,
    textTransform: 'uppercase',
  },
  collectionsGrid: {
    gap: 16,
  },
  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
  },
  collectionImageContainer: {
    width: 120,
    height: 100,
    position: 'relative',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  collectionColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  collectionInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  collectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  collectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  collectionActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginRight: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Horizontal scroll container for search results
  horizontalScrollContainer: {
    paddingVertical: 20,
    paddingRight: 20,
  },
});

export default styles; 