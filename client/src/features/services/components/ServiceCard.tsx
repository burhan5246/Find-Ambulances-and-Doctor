import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import type { Service } from '../../../types/service';
import { Badge } from '../../../components/ui/Badge';
import { MapPin, Edit2, Trash2 } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg};
  background: white;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radii.lg};
  transition: all ${theme.transitions.fast};
  min-width: 0;

  &:hover {
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.gray[200]};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
  }
`;

const ThumbnailWrapper = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 100px;
  position: relative;
  overflow: hidden;
  border-radius: ${theme.radii.lg};
  background: linear-gradient(135deg, ${theme.colors.primary[100]}, ${theme.colors.accent[100]});

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    height: 150px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  opacity: 0.85;
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-width: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    gap: ${theme.spacing.xs};
    width: 100%;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
  min-width: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${theme.spacing.xs};
  }
`;

const Title = styled.h3`
  font-size: ${theme.fontSizes.lg};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  line-height: 1.2;
  margin: 0;
  font-family: ${theme.fonts.heading};
  min-width: 0;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.md};
    flex: 1;
    min-width: 0;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: ${theme.colors.doctor.bg};
  color: ${theme.colors.doctor.text};
  font-size: ${theme.fontSizes.xs};
  font-weight: ${theme.fontWeights.semibold};
  border-radius: ${theme.radii.full};
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0.2rem 0.6rem;
    font-size: 0.65rem;
  }
`;

const Description = styled.p`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[600]};
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[600]};
  font-weight: ${theme.fontWeights.medium};
  min-width: 0;
  overflow-wrap: break-word;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.xs};
  }
`;

const ActionsWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.md}) {
    width: 100%;
    justify-content: flex-start;
    gap: ${theme.spacing.sm};
  }
`;

const ActionIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: ${theme.radii.md};
  background: transparent;
  color: ${theme.colors.gray[600]};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[900]};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${theme.breakpoints.md}) {
    width: 32px;
    height: 32px;
  }
`;

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <ListItem>
      <ThumbnailWrapper>
        {service.imageUrl ? (
          <ThumbnailImage
            src={service.imageUrl}
            alt={service.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.removeAttribute('style');
            }}
          />
        ) : null}
        {!service.imageUrl && (
          <ThumbnailPlaceholder aria-hidden="true">
            {service.type === 'ambulance' ? '🚑' : '👨‍⚕️'}
          </ThumbnailPlaceholder>
        )}
        
      </ThumbnailWrapper>

      <ContentSection>
        <TitleRow>
          
            <Badge type={service.type} />
          
          <Title>{service.title}</Title>
          <StatusBadge>Available</StatusBadge>
        </TitleRow>
        <Description>{service.description}</Description>
        <LocationRow>
          <MapPin size={14} aria-hidden="true" />
          <span>{service.location}</span>
        </LocationRow>
      </ContentSection>

      <ActionsWrapper>
        <ActionIconButton
          onClick={() => onEdit(service)}
          aria-label={`Edit ${service.title}`}
          title="Edit"
        >
          <Edit2 size={18} />
        </ActionIconButton>
        <ActionIconButton
          onClick={() => onDelete(service)}
          aria-label={`Delete ${service.title}`}
          title="Delete"
        >
          <Trash2 size={18} color={theme.colors.error} />
        </ActionIconButton>
      </ActionsWrapper>
    </ListItem>
  );
}

