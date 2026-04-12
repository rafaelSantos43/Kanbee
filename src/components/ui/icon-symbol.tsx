import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SymbolWeight, SymbolViewProps } from 'expo-symbols'
import { ComponentProps } from 'react'
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native'

type IconSymbolName = Extract<SymbolViewProps['name'], string>
type MaterialIconName = ComponentProps<typeof MaterialIcons>['name']

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} satisfies Partial<Record<IconSymbolName, MaterialIconName>>

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof MAPPING
  size?: number
  color: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] ?? 'help-outline'} style={style} />
}
